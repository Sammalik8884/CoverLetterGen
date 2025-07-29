namespace CoverLetterGen.Models
{
    public class GumroadWebhookRequest
    {
        public string ProductId { get; set; } = "";
        public string Email { get; set; } = "";
        public string PriceInCents { get; set; } = "";
        public string Currency { get; set; } = "";
        public string Quantity { get; set; } = "";
        public string ProductName { get; set; } = "";
        public string TransactionId { get; set; } = "";
        public string Variant { get; set; } = "";
        public string Test { get; set; } = "";
        public string Recurrence { get; set; } = "";
        public string IsGift { get; set; } = "";
        public string Refunded { get; set; } = "";
        public string PartialRefunded { get; set; } = "";
        public string Chargedback { get; set; } = "";
        public string Pending { get; set; } = "";
        public string SubscriptionId { get; set; } = "";
        public string CustomerId { get; set; } = "";
        public string IpCountry { get; set; } = "";
        public string IpCountryCode { get; set; } = "";
        public string IpCity { get; set; } = "";
        public string Ip { get; set; } = "";
        public string UserAgent { get; set; } = "";
        public string Referer { get; set; } = "";
        public string OrderId { get; set; } = "";
        public string Disputed { get; set; } = "";
        public string DisputeWon { get; set; } = "";
        public string Id { get; set; } = "";
        public string CreatedAt { get; set; } = "";
        public string UpdatedAt { get; set; } = "";
        public string SubscriptionEndDate { get; set; } = "";
        public string CancelledAt { get; set; } = "";
        public string CancelReason { get; set; } = "";
        public string CustomFields { get; set; } = "";
        public string Metadata { get; set; } = "";
        public string Timestamp { get; set; } = "";
        public string Signature { get; set; } = "";
    }

    public class PaymentResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public string TransactionId { get; set; } = "";
    }

    public class SubscriptionStatus
    {
        public bool IsPro { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string Plan { get; set; } = "";
    }
} 