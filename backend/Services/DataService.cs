using Microsoft.EntityFrameworkCore;
using CoverLetterGen.Models;

namespace CoverLetterGen.Services
{
    public interface IDataService
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByIdAsync(int id);
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task<CoverLetter> AddCoverLetterAsync(CoverLetter coverLetter);
        Task<List<CoverLetter>> GetCoverLettersByUserIdAsync(int userId);
        Task<CoverLetter?> GetCoverLetterByIdAsync(int id);
        Task<bool> DeleteCoverLetterAsync(int id);
        Task<int> GetMonthlyUsageAsync(string email, DateTime month);
        Task<List<User>> GetAllUsersAsync();
        Task DeleteUserAsync(string email);
        Task<bool> UserExistsAsync(string email);
        Task SaveRefreshTokenAsync(string refreshToken, string email);
        Task<string?> GetEmailByRefreshTokenAsync(string refreshToken);
        Task RemoveRefreshTokenAsync(string refreshToken);
    }

    public class DataService : IDataService
    {
        private readonly AppDbContext _context;

        public DataService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.CoverLetters)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users
                .Include(u => u.CoverLetters)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User> CreateUserAsync(User user)
        {
            user.Email = user.Email.ToLower();
            user.CreatedAt = DateTime.UtcNow;
            user.LastLoginAt = DateTime.UtcNow;
            
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<CoverLetter> AddCoverLetterAsync(CoverLetter coverLetter)
        {
            coverLetter.CreatedAt = DateTime.UtcNow;
            _context.CoverLetters.Add(coverLetter);
            await _context.SaveChangesAsync();
            return coverLetter;
        }

        public async Task<List<CoverLetter>> GetCoverLettersByUserIdAsync(int userId)
        {
            return await _context.CoverLetters
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .AsNoTracking() // Prevent tracking to avoid circular references
                .ToListAsync();
        }

        public async Task<CoverLetter?> GetCoverLetterByIdAsync(int id)
        {
            return await _context.CoverLetters
                .Include(c => c.User)
                .AsNoTracking() // Prevent tracking to avoid circular references
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<bool> DeleteCoverLetterAsync(int id)
        {
            var coverLetter = await _context.CoverLetters.FindAsync(id);
            if (coverLetter == null) return false;
            
            _context.CoverLetters.Remove(coverLetter);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetMonthlyUsageAsync(string email, DateTime month)
        {
            var user = await GetUserByEmailAsync(email);
            if (user == null) return 0;

            var startOfMonth = new DateTime(month.Year, month.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);

            return await _context.CoverLetters.CountAsync(c =>
                c.UserId == user.Id &&
                c.CreatedAt >= startOfMonth &&
                c.CreatedAt < endOfMonth);
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task DeleteUserAsync(string email)
        {
            var user = await GetUserByEmailAsync(email);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email.ToLower() == email.ToLower());
        }

        // For now, keep refresh token storage in file (as in SimpleDataStore)
        // This can be migrated to database later if needed
        private static readonly string RefreshTokenFile = "refresh_tokens.txt";
        private static readonly object RefreshTokenFileLock = new();

        public Task SaveRefreshTokenAsync(string refreshToken, string email)
        {
            lock (RefreshTokenFileLock)
            {
                File.AppendAllLines(RefreshTokenFile, new[] { $"{refreshToken}|{email}" });
            }
            return Task.CompletedTask;
        }

        public Task<string?> GetEmailByRefreshTokenAsync(string refreshToken)
        {
            lock (RefreshTokenFileLock)
            {
                if (!File.Exists(RefreshTokenFile)) return Task.FromResult<string?>(null);
                var lines = File.ReadAllLines(RefreshTokenFile);
                foreach (var line in lines)
                {
                    var parts = line.Split('|');
                    if (parts.Length == 2 && parts[0] == refreshToken)
                        return Task.FromResult<string?>(parts[1]);
                }
                return Task.FromResult<string?>(null);
            }
        }

        public Task RemoveRefreshTokenAsync(string refreshToken)
        {
            lock (RefreshTokenFileLock)
            {
                if (!File.Exists(RefreshTokenFile)) return Task.CompletedTask;
                var lines = File.ReadAllLines(RefreshTokenFile).ToList();
                lines.RemoveAll(l => l.StartsWith(refreshToken + "|"));
                File.WriteAllLines(RefreshTokenFile, lines);
            }
            return Task.CompletedTask;
        }
    }
} 