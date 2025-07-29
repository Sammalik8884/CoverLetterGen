using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using CoverLetterGen.Models;

namespace CoverLetterGen.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RefreshTokenAsync(string refreshToken);
        Task<UserDto?> GetUserFromTokenAsync(string token);
    }

    public class AuthService : IAuthService
    {
        private readonly IDataService _dataService;
        private readonly IConfiguration _configuration;

        public AuthService(IDataService dataService, IConfiguration configuration)
        {
            _dataService = dataService;
            _configuration = configuration;
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

            // Generate tokens
            var (token, refreshToken, expiresAt) = GenerateTokens(user);

            // Save refresh token
            await _dataService.SaveRefreshTokenAsync(refreshToken, user.Email);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                User = MapToUserDto(user),
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            // Get user
            var user = await _dataService.GetUserByEmailAsync(request.Email);
            if (user == null)
            {
                throw new Exception("Invalid credentials");
            }

            // Verify password
            if (!VerifyPassword(request.Password, user.PasswordHash))
            {
                throw new Exception("Invalid credentials");
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _dataService.UpdateUserAsync(user);

            // Generate tokens
            var (token, refreshToken, expiresAt) = GenerateTokens(user);

            // Save refresh token
            await _dataService.SaveRefreshTokenAsync(refreshToken, user.Email);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                User = MapToUserDto(user),
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            // Get email from refresh token
            var email = await _dataService.GetEmailByRefreshTokenAsync(refreshToken);
            if (string.IsNullOrEmpty(email))
            {
                throw new Exception("Invalid refresh token");
            }

            // Get user
            var user = await _dataService.GetUserByEmailAsync(email);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Remove old refresh token
            await _dataService.RemoveRefreshTokenAsync(refreshToken);

            // Generate new tokens
            var (token, newRefreshToken, expiresAt) = GenerateTokens(user);

            // Save new refresh token
            await _dataService.SaveRefreshTokenAsync(newRefreshToken, user.Email);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = newRefreshToken,
                User = MapToUserDto(user),
                ExpiresAt = expiresAt
            };
        }

        public async Task<UserDto?> GetUserFromTokenAsync(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"] ?? throw new Exception("JWT secret not configured"));

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"],
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var email = jwtToken.Claims.First(x => x.Type == ClaimTypes.Email).Value;

                var user = await _dataService.GetUserByEmailAsync(email);
                return user != null ? MapToUserDto(user) : null;
            }
            catch
            {
                return null;
            }
        }

        private (string token, string refreshToken, DateTime expiresAt) GenerateTokens(User user)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"] ?? throw new Exception("JWT secret not configured"));
            var expiresAt = DateTime.UtcNow.AddDays(7);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
                }),
                Expires = expiresAt,
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var refreshToken = GenerateRefreshToken();

            return (tokenHandler.WriteToken(token), refreshToken, expiresAt);
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

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
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