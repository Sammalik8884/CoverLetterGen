using System.ComponentModel.DataAnnotations;

namespace CoverLetterGen.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime LastLoginAt { get; set; } = DateTime.UtcNow;
        
        public bool IsPro { get; set; } = false;
        public string? ProSubscriptionId { get; set; }
        public DateTime? ProExpiresAt { get; set; }
        
        // Auth enhancements
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
        public string? GoogleSubjectId { get; set; }
        
        // Navigation property
        public List<CoverLetter> CoverLetters { get; set; } = new();
    }
} 