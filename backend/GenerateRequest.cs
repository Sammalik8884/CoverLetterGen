namespace CoverLetterGen.Models
{
    public class GenerateRequest
    {
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string UserInfo { get; set; } = string.Empty;
        public string? Tone { get; set; } // professional, friendly, creative, formal
        public string? ExperienceLevel { get; set; } // entry-level, mid-level, senior
        public string? Language { get; set; } // en, de, es, fr
    }
}