using System.Collections.Concurrent;
using CoverLetterGen.Models;

namespace CoverLetterGen
{
    // Simple in-memory data store to replace EF Core temporarily
    public class SimpleDataStore
    {
        private static readonly ConcurrentDictionary<string, User> _users = new();
        private static readonly ConcurrentDictionary<int, CoverLetter> _coverLetters = new();
        private static int _nextUserId = 1;
        private static int _nextCoverLetterId = 1;
        private static readonly string RefreshTokenFile = "refresh_tokens.txt";
        private static readonly object RefreshTokenFileLock = new();
        
        public User? GetUserByEmail(string email)
        {
            return _users.TryGetValue(email.ToLower(), out var user) ? user : null;
        }

        public User? GetUserById(int id)
        {
            return _users.Values.FirstOrDefault(u => u.Id == id);
        }

        public User CreateUser(User user)
        {
            user.Id = _nextUserId++;
            user.Email = user.Email.ToLower();
            _users[user.Email] = user;
            return user;
        }

        public void UpdateUser(User user)
        {
            if (_users.ContainsKey(user.Email))
            {
                _users[user.Email] = user;
            }
        }

        public CoverLetter AddCoverLetter(CoverLetter coverLetter)
        {
            coverLetter.Id = _nextCoverLetterId++;
            _coverLetters[coverLetter.Id] = coverLetter;
            return coverLetter;
        }

        public List<CoverLetter> GetCoverLettersByUserId(int userId)
        {
            return _coverLetters.Values.Where(c => c.UserId == userId).OrderByDescending(c => c.CreatedAt).ToList();
        }

        public CoverLetter? GetCoverLetterById(int id)
        {
            return _coverLetters.TryGetValue(id, out var coverLetter) ? coverLetter : null;
        }

        public bool DeleteCoverLetter(int id)
        {
            return _coverLetters.TryRemove(id, out _);
        }

        public int GetMonthlyUsage(string email, DateTime month)
        {
            var user = GetUserByEmail(email);
            if (user == null) return 0;

            var startOfMonth = new DateTime(month.Year, month.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);

            return _coverLetters.Values.Count(c =>
                c.UserId == user.Id &&
                c.CreatedAt >= startOfMonth &&
                c.CreatedAt < endOfMonth);
        }

        public List<User> GetAllUsers()
        {
            return _users.Values.ToList();
        }

        public void DeleteUser(string email)
        {
            _users.TryRemove(email.ToLower(), out _);
        }

        public bool UserExists(string email)
        {
            return _users.ContainsKey(email.ToLower());
        }

        public void SaveRefreshToken(string refreshToken, string email)
        {
            lock (RefreshTokenFileLock)
            {
                File.AppendAllLines(RefreshTokenFile, new[] { $"{refreshToken}|{email}" });
            }
        }

        public string? GetEmailByRefreshToken(string refreshToken)
        {
            lock (RefreshTokenFileLock)
            {
                if (!File.Exists(RefreshTokenFile)) return null;
                var lines = File.ReadAllLines(RefreshTokenFile);
                foreach (var line in lines)
                {
                    var parts = line.Split('|');
                    if (parts.Length == 2 && parts[0] == refreshToken)
                        return parts[1];
                }
                return null;
            }
        }

        public void RemoveRefreshToken(string refreshToken)
        {
            lock (RefreshTokenFileLock)
            {
                if (!File.Exists(RefreshTokenFile)) return;
                var lines = File.ReadAllLines(RefreshTokenFile).ToList();
                lines.RemoveAll(l => l.StartsWith(refreshToken + "|"));
                File.WriteAllLines(RefreshTokenFile, lines);
            }
        }
    }
} 