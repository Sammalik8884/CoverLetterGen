using System.Security.Cryptography;
using System.Text;
using CoverLetterGen.Models;

namespace CoverLetterGen.Services
{
    public interface IPaymentService
    {
        Task<bool> VerifyGumroadWebhookAsync(GumroadWebhookRequest request, string signature);
        Task<bool> ProcessPaymentAsync(GumroadWebhookRequest request);
        Task<bool> CancelSubscriptionAsync(string email);
        Task<SubscriptionStatus> GetSubscriptionStatusAsync(string email);
    }

    public class PaymentService : IPaymentService
    {
        private readonly IDataService _dataService;
        private readonly IConfiguration _configuration;
        private readonly string _gumroadSecret;

        public PaymentService(IDataService dataService, IConfiguration configuration)
        {
            _dataService = dataService;
            _configuration = configuration;
            _gumroadSecret = configuration["Gumroad:Secret"] ?? Environment.GetEnvironmentVariable("GUMROAD_SECRET") ?? "";
        }

        public async Task<bool> VerifyGumroadWebhookAsync(GumroadWebhookRequest request, string signature)
        {
            if (string.IsNullOrEmpty(_gumroadSecret))
            {
                return false;
            }

            // Create the verification string
            var verificationString = $"{request.ProductId}{request.Email}{request.PriceInCents}{request.Currency}{request.Quantity}{request.ProductName}{request.TransactionId}{request.Variant}{request.Test}{request.Recurrence}{request.IsGift}{request.Refunded}{request.PartialRefunded}{request.Chargedback}{request.Pending}{request.SubscriptionId}{request.CustomerId}{request.IpCountry}{request.IpCountryCode}{request.IpCity}{request.Ip}{request.UserAgent}{request.Referer}{request.OrderId}{request.Disputed}{request.DisputeWon}{request.Id}{request.CreatedAt}{request.UpdatedAt}{request.SubscriptionEndDate}{request.CancelledAt}{request.CancelReason}{request.CustomFields}{request.Metadata}{request.Timestamp}";

            // Create HMAC signature
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_gumroadSecret));
            var computedSignature = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(verificationString)));

            return computedSignature == signature;
        }

        public async Task<bool> ProcessPaymentAsync(GumroadWebhookRequest request)
        {
            try
            {
                var user = await _dataService.GetUserByEmailAsync(request.Email);
                if (user == null)
                {
                    return false;
                }

                // Check if this is a subscription payment
                if (!string.IsNullOrEmpty(request.SubscriptionId))
                {
                    // Handle subscription payment
                    user.IsPro = true;
                    user.ProExpiresAt = DateTime.UtcNow.AddYears(1); // 1 year subscription
                    user.ProSubscriptionId = request.SubscriptionId;
                }
                else
                {
                    // Handle one-time payment
                    user.IsPro = true;
                    user.ProExpiresAt = DateTime.UtcNow.AddYears(1);
                }

                await _dataService.UpdateUserAsync(user);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing payment: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> CancelSubscriptionAsync(string email)
        {
            try
            {
                var user = await _dataService.GetUserByEmailAsync(email);
                if (user == null)
                {
                    return false;
                }

                user.IsPro = false;
                user.ProExpiresAt = null;
                user.ProSubscriptionId = null;

                await _dataService.UpdateUserAsync(user);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error canceling subscription: {ex.Message}");
                return false;
            }
        }

        public async Task<SubscriptionStatus> GetSubscriptionStatusAsync(string email)
        {
            try
            {
                var user = await _dataService.GetUserByEmailAsync(email);
                if (user == null)
                {
                    return new SubscriptionStatus { IsPro = false };
                }

                // Check if Pro subscription is still valid
                var isPro = user.IsPro && (user.ProExpiresAt == null || user.ProExpiresAt > DateTime.UtcNow);
                
                return new SubscriptionStatus
                {
                    IsPro = isPro,
                    ExpiresAt = user.ProExpiresAt,
                    Plan = isPro ? "Pro" : "Free"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting subscription status: {ex.Message}");
                return new SubscriptionStatus { IsPro = false };
            }
        }
    }
} 