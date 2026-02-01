using System.Security.Cryptography;
using System.Text;
using CoverLetterGen.Models;

namespace CoverLetterGen.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        // New methods
        Task ForgotPasswordAsync(string email);
        Task ResetPasswordAsync(string token, string newPassword);
        Task<AuthResponse> GoogleLoginAsync(string googleToken);
    }

    public class AuthService : IAuthService
    {
        private readonly IDataService _dataService;
        private readonly IEmailService _emailService;

        public AuthService(IDataService dataService, IEmailService emailService)
        {
            _dataService = dataService;
            _emailService = emailService;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // Check if user already exists
            if (await _dataService.UserExistsAsync(request.Email))
            {
                throw new Exception("User already exists");
            }

            // Validate password complexity
            ValidatePassword(request.Password);

            // Hash password
            var passwordHash = HashPassword(request.Password);

            // Create user
            var user = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                FirstName = request.FirstName,
                LastName = request.LastName,
                CreatedAt = DateTime.UtcNow,
                LastLoginAt = DateTime.UtcNow,
                IsPro = false
            };

            await _dataService.CreateUserAsync(user);

            return new AuthResponse
            {
                User = MapToUserDto(user)
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            // Get user
            var user = await _dataService.GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                throw new InvalidOperationException("Invalid credentials");
            }

            // Verify password
            if (!VerifyPassword(request.Password, user.PasswordHash))
            {
                throw new InvalidOperationException("Invalid credentials");
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _dataService.UpdateUserAsync(user);

            return new AuthResponse
            {
                User = MapToUserDto(user)
            };
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }

        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _dataService.GetUserByEmailAsync(email);
            if (user == null)
            {
                // Don't reveal if user exists
                return;
            }

            // Generate reset token
            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            user.ResetToken = token;
            user.ResetTokenExpires = DateTime.UtcNow.AddHours(24); // 24 hour expiry

            await _dataService.UpdateUserAsync(user);

            // Send reset email
            // Use a hardcoded URL for now or better, from configuration
            // In production it should match the frontend URL
            var resetLink = $"https://coverlettergen.vercel.app/reset-password?token={token}";
            // Determine dev vs prod? For now let's assume one main domain. 
            // Better: Pass the FE URL via config or guess it. 
            
            await _emailService.SendPasswordResetEmailAsync(email, resetLink);
        }

        public async Task ResetPasswordAsync(string token, string newPassword)
        {
            var user = await _dataService.GetUserByResetTokenAsync(token);
            if (user == null)
            {
                throw new Exception("Invalid or expired reset token.");
            }

            ValidatePassword(newPassword);

            user.PasswordHash = HashPassword(newPassword);
            user.ResetToken = null;
            user.ResetTokenExpires = null;

            await _dataService.UpdateUserAsync(user);
        }

        public async Task<AuthResponse> GoogleLoginAsync(string googleToken)
        {
            try
            {
                // Verify Google Token
                var payload = await Google.Apis.Auth.GoogleJsonWebSignature.ValidateAsync(googleToken);
                
                var user = await _dataService.GetUserByEmailAsync(payload.Email);
                if (user == null)
                {
                    // Create new user
                    user = new User
                    {
                        Email = payload.Email,
                        FirstName = payload.GivenName ?? "User",
                        LastName = payload.FamilyName ?? "",
                        CreatedAt = DateTime.UtcNow,
                        LastLoginAt = DateTime.UtcNow,
                        GoogleSubjectId = payload.Subject,
                        PasswordHash = "" // No password for Google users initially
                    };
                    await _dataService.CreateUserAsync(user);
                }
                else
                {
                    // Update existing user with Google ID if missing
                    if (string.IsNullOrEmpty(user.GoogleSubjectId))
                    {
                        user.GoogleSubjectId = payload.Subject;
                    }
                    user.LastLoginAt = DateTime.UtcNow;
                    await _dataService.UpdateUserAsync(user);
                }

                return new AuthResponse
                {
                    User = MapToUserDto(user)
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Invalid Google Token: " + ex.Message);
            }
        }

        private UserDto MapToUserDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreatedAt = user.CreatedAt,
                IsPro = user.IsPro,
                ProExpiresAt = user.ProExpiresAt
            };
        }

        private void ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password) || password.Length < 8)
                throw new Exception("Password must be at least 8 characters long.");
                
            if (!password.Any(char.IsUpper))
                throw new Exception("Password must contain at least one uppercase letter.");
                
            if (!password.Any(char.IsLower))
                throw new Exception("Password must contain at least one lowercase letter.");
                
            if (!password.Any(char.IsDigit))
                throw new Exception("Password must contain at least one number.");
                
            if (!password.Any(ch => !char.IsLetterOrDigit(ch)))
                throw new Exception("Password must contain at least one special character.");
        }
    }
} 