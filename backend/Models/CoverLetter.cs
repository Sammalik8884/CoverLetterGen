namespace CoverLetterGen.Models
{
    public class CoverLetter
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int UserId { get; set; }
        public User? User { get; set; }
        public string? Tone { get; set; } // professional, friendly, creative, formal
        public string? ExperienceLevel { get; set; } // entry-level, mid-level, senior
        public string? Language { get; set; } // en, de, es, fr
        public int? TokensUsed { get; set; } // OpenAI tokens used
    }
} 