using System.Security.Cryptography;
using System.Text;
using CoverLetterGen.Models;

namespace CoverLetterGen.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
    }

    public class AuthService : IAuthService
    {
        private readonly IDataService _dataService;

        public AuthService(IDataService dataService)
        {
            _dataService = dataService;
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            // Check if user already exists
            if (await _dataService.UserExistsAsync(request.Email))
            {
                throw new Exception("User already exists");
            }

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
    }
} 