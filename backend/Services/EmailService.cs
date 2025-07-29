using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;

namespace CoverLetterGen.Services
{
    public interface IEmailService
    {
        Task<bool> SendCoverLetterEmailAsync(string toEmail, string coverLetterContent, string jobTitle, string companyName);
        Task<bool> SendWelcomeEmailAsync(string toEmail, string firstName);
        Task<bool> SendProUpgradeEmailAsync(string toEmail, string firstName);
    }

    public class EmailService : IEmailService
    {
        private readonly ISendGridClient _sendGridClient;
        private readonly IConfiguration _configuration;
        private readonly string _fromEmail;
        private readonly string _fromName;

        public EmailService(IConfiguration configuration)
        {
            var apiKey = configuration["SendGrid:ApiKey"] ?? Environment.GetEnvironmentVariable("SENDGRID_API_KEY");
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new Exception("SendGrid API key not configured");
            }
            
            _sendGridClient = new SendGridClient(apiKey);
            _configuration = configuration;
            _fromEmail = configuration["SendGrid:FromEmail"] ?? "noreply@coverlettergen.com";
            _fromName = configuration["SendGrid:FromName"] ?? "CoverLetterGen";
        }

        public async Task<bool> SendCoverLetterEmailAsync(string toEmail, string coverLetterContent, string jobTitle, string companyName)
        {
            try
            {
                var subject = $"Your Cover Letter for {jobTitle} at {companyName}";
                var htmlContent = CreateCoverLetterEmailTemplate(coverLetterContent, jobTitle, companyName);
                var plainTextContent = CreatePlainTextCoverLetter(coverLetterContent, jobTitle, companyName);

                var msg = MailHelper.CreateSingleEmail(
                    new EmailAddress(_fromEmail, _fromName),
                    new EmailAddress(toEmail),
                    subject,
                    plainTextContent,
                    htmlContent
                );

                var response = await _sendGridClient.SendEmailAsync(msg);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                // Log the error (in production, use proper logging)
                Console.WriteLine($"Error sending email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendWelcomeEmailAsync(string toEmail, string firstName)
        {
            try
            {
                var subject = "Welcome to CoverLetterGen!";
                var htmlContent = CreateWelcomeEmailTemplate(firstName);
                var plainTextContent = CreatePlainTextWelcome(firstName);

                var msg = MailHelper.CreateSingleEmail(
                    new EmailAddress(_fromEmail, _fromName),
                    new EmailAddress(toEmail),
                    subject,
                    plainTextContent,
                    htmlContent
                );

                var response = await _sendGridClient.SendEmailAsync(msg);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending welcome email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendProUpgradeEmailAsync(string toEmail, string firstName)
        {
            try
            {
                var subject = "Welcome to CoverLetterGen Pro!";
                var htmlContent = CreateProUpgradeEmailTemplate(firstName);
                var plainTextContent = CreatePlainTextProUpgrade(firstName);

                var msg = MailHelper.CreateSingleEmail(
                    new EmailAddress(_fromEmail, _fromName),
                    new EmailAddress(toEmail),
                    subject,
                    plainTextContent,
                    htmlContent
                );

                var response = await _sendGridClient.SendEmailAsync(msg);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending pro upgrade email: {ex.Message}");
                return false;
            }
        }

        private string CreateCoverLetterEmailTemplate(string coverLetterContent, string jobTitle, string companyName)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title>Your Cover Letter</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }}
        .cover-letter {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; white-space: pre-wrap; }}
        .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Your Cover Letter is Ready!</h1>
            <p>Generated for {jobTitle} at {companyName}</p>
        </div>
        <div class='content'>
            <h2>Cover Letter Content:</h2>
            <div class='cover-letter'>{coverLetterContent}</div>
            <p><strong>Tip:</strong> Customize this cover letter to match your specific experience and the company's culture.</p>
        </div>
        <div class='footer'>
            <p>Generated by CoverLetterGen - AI-Powered Cover Letter Generator</p>
            <p>Need more cover letters? <a href='https://coverlettergen.com'>Upgrade to Pro</a></p>
        </div>
    </div>
</body>
</html>";
        }

        private string CreatePlainTextCoverLetter(string coverLetterContent, string jobTitle, string companyName)
        {
            return $@"Your Cover Letter for {jobTitle} at {companyName}

{coverLetterContent}

---
Generated by CoverLetterGen - AI-Powered Cover Letter Generator
Upgrade to Pro for unlimited cover letters: https://coverlettergen.com";
        }

        private string CreateWelcomeEmailTemplate(string firstName)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title>Welcome to CoverLetterGen</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }}
        .content {{ background: #f9f9f9; padding: 30px; border-radius: 8px; margin-top: 20px; }}
        .cta {{ background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Welcome to CoverLetterGen!</h1>
        </div>
        <div class='content'>
            <h2>Hi {firstName},</h2>
            <p>Welcome to CoverLetterGen! We're excited to help you create professional cover letters that stand out.</p>
            <p><strong>What you can do:</strong></p>
            <ul>
                <li>Generate professional cover letters in seconds</li>
                <li>Customize tone and experience level</li>
                <li>Support for multiple languages</li>
                <li>Download as PDF or send via email</li>
            </ul>
            <p><strong>Free Plan:</strong> 3 cover letters per month</p>
            <p><strong>Pro Plan:</strong> Unlimited cover letters + advanced features</p>
            <a href='https://coverlettergen.com/generator' class='cta'>Create Your First Cover Letter</a>
        </div>
    </div>
</body>
</html>";
        }

        private string CreatePlainTextWelcome(string firstName)
        {
            return $@"Welcome to CoverLetterGen!

Hi {firstName},

Welcome to CoverLetterGen! We're excited to help you create professional cover letters that stand out.

What you can do:
- Generate professional cover letters in seconds
- Customize tone and experience level  
- Support for multiple languages
- Download as PDF or send via email

Free Plan: 3 cover letters per month
Pro Plan: Unlimited cover letters + advanced features

Get started: https://coverlettergen.com/generator

Best regards,
The CoverLetterGen Team";
        }

        private string CreateProUpgradeEmailTemplate(string firstName)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <title>Welcome to CoverLetterGen Pro</title>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }}
        .content {{ background: #f9f9f9; padding: 30px; border-radius: 8px; margin-top: 20px; }}
        .feature {{ background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Welcome to CoverLetterGen Pro!</h1>
        </div>
        <div class='content'>
            <h2>Congratulations {firstName}!</h2>
            <p>You've successfully upgraded to CoverLetterGen Pro. Here's what you now have access to:</p>
            
            <div class='feature'>
                <strong>✨ Unlimited Cover Letters</strong><br>
                Generate as many cover letters as you need
            </div>
            
            <div class='feature'>
                <strong>🚀 Advanced Customization</strong><br>
                More tone options and experience levels
            </div>
            
            <div class='feature'>
                <strong>📧 Priority Email Support</strong><br>
                Get help when you need it most
            </div>
            
            <div class='feature'>
                <strong>📊 Advanced Analytics</strong><br>
                Track your cover letter performance
            </div>
            
            <p>Your Pro subscription is active for 1 year. Thank you for choosing CoverLetterGen!</p>
            <a href='https://coverlettergen.com/generator' style='background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;'>Start Creating</a>
        </div>
    </div>
</body>
</html>";
        }

        private string CreatePlainTextProUpgrade(string firstName)
        {
            return $@"Welcome to CoverLetterGen Pro!

Congratulations {firstName}!

You've successfully upgraded to CoverLetterGen Pro. Here's what you now have access to:

✨ Unlimited Cover Letters
Generate as many cover letters as you need

🚀 Advanced Customization  
More tone options and experience levels

📧 Priority Email Support
Get help when you need it most

📊 Advanced Analytics
Track your cover letter performance

Your Pro subscription is active for 1 year. Thank you for choosing CoverLetterGen!

Get started: https://coverlettergen.com/generator

Best regards,
The CoverLetterGen Team";
        }
    }
} 