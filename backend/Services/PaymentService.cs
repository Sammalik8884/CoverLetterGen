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

        public Task<bool> VerifyGumroadWebhookAsync(GumroadWebhookRequest request, string signature)
        {
            // If no webhook secret is configured, skip verification (for development)
            if (string.IsNullOrEmpty(_gumroadSecret))
            {
                Console.WriteLine("Warning: No webhook secret configured, skipping signature verification");
                return Task.FromResult(true);
            }

            // If no signature provided, reject
            if (string.IsNullOrEmpty(signature))
            {
                Console.WriteLine("Error: No signature provided in webhook");
                return Task.FromResult(false);
            }

            try
            {
                // Create the verification string
                var verificationString = $"{request.ProductId}{request.Email}{request.PriceInCents}{request.Currency}{request.Quantity}{request.ProductName}{request.TransactionId}{request.Variant}{request.Test}{request.Recurrence}{request.IsGift}{request.Refunded}{request.PartialRefunded}{request.Chargedback}{request.Pending}{request.SubscriptionId}{request.CustomerId}{request.IpCountry}{request.IpCountryCode}{request.IpCity}{request.Ip}{request.UserAgent}{request.Referer}{request.OrderId}{request.Disputed}{request.DisputeWon}{request.Id}{request.CreatedAt}{request.UpdatedAt}{request.SubscriptionEndDate}{request.CancelledAt}{request.CancelReason}{request.CustomFields}{request.Metadata}{request.Timestamp}";

                // Create HMAC signature
                using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_gumroadSecret));
                var computedSignature = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(verificationString)));

                var isValid = computedSignature == signature;
                Console.WriteLine($"Webhook signature verification: {(isValid ? "PASSED" : "FAILED")}");
                
                return Task.FromResult(isValid);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error verifying webhook signature: {ex.Message}");
                return Task.FromResult(false);
            }
        }

        public async Task<bool> ProcessPaymentAsync(GumroadWebhookRequest request)
        {
            try
            {
                var user = await _dataService.GetUserByEmailAsync(request.Email);
                if (user == null)
                {
                    Console.WriteLine($"User not found for email: {request.Email}");
                    return false;
                }

                // Get product IDs from configuration
                var monthlyProductId = _configuration["Gumroad:MonthlyProductId"];
                var annualProductId = _configuration["Gumroad:AnnualProductId"];

                // Determine subscription duration based on product ID
                DateTime? proExpiresAt = null;
                
                if (request.ProductId == monthlyProductId)
                {
                    // Monthly subscription
                    proExpiresAt = DateTime.UtcNow.AddMonths(1);
                    Console.WriteLine($"Processing monthly subscription for user: {request.Email}");
                }
                else if (request.ProductId == annualProductId)
                {
                    // Annual subscription
                    proExpiresAt = DateTime.UtcNow.AddYears(1);
                    Console.WriteLine($"Processing annual subscription for user: {request.Email}");
                }
                else
                {
                    // Unknown product ID, default to monthly
                    proExpiresAt = DateTime.UtcNow.AddMonths(1);
                    Console.WriteLine($"Unknown product ID: {request.ProductId}, defaulting to monthly for user: {request.Email}");
                }

                // Update user subscription
                user.IsPro = true;
                user.ProExpiresAt = proExpiresAt;
                user.ProSubscriptionId = request.SubscriptionId ?? request.TransactionId;

                await _dataService.UpdateUserAsync(user);
                Console.WriteLine($"Successfully upgraded user {request.Email} to Pro until {proExpiresAt}");
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