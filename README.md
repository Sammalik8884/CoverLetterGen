# Cover Letter Generator

A full-stack web application for generating professional cover letters using AI. Built with ASP.NET Core backend and React frontend.

## Features

- 🤖 AI-powered cover letter generation using OpenAI GPT-4o-mini
- 🔐 Secure cookie-based authentication
- 📊 Analytics dashboard with usage tracking
- 📧 Email sharing functionality
- 📄 PDF download capability
- 🌐 Multi-language support
- 💳 Pro subscription management
- 📱 Responsive design

## Tech Stack

### Backend
- **ASP.NET Core 8.0** - Web API framework
- **Entity Framework Core** - ORM with SQLite database
- **Serilog** - Structured logging
- **OpenAI API** - AI-powered content generation
- **Cookie Authentication** - Secure session management

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **React Router** - Client-side routing

## Quick Start

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+ and npm
- OpenAI API key

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sammalik8884/CoverLetterGen.git
   cd CoverLetterGen
   ```

2. **Set up environment variables**
   ```bash
   # For development, set your OpenAI API key
   set OPENAI_API_KEY=your-actual-openai-api-key-here
   ```

3. **Run the backend**
   ```bash
   cd backend
   dotnet restore
   dotnet run
   ```
   The API will be available at `http://localhost:5026`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## Environment Variables

### Backend (.env or system environment variables)
```env
OPENAI_API_KEY=your-openai-api-key-here
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5026
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/validate` - Validate authentication

### Cover Letters
- `POST /generate` - Generate cover letter
- `POST /generate/{language}` - Generate cover letter in specific language
- `GET /coverletters` - Get user's cover letters
- `DELETE /coverletters/{id}` - Delete cover letter
- `GET /coverletters/{id}/download` - Download as PDF
- `POST /coverletters/{id}/share` - Share via email

### Analytics
- `GET /analytics` - Get user analytics and usage stats

### Languages
- `GET /languages` - Get supported languages

## Security Features

- **Cookie-based Authentication** - Secure session management
- **CSRF Protection** - Cross-site request forgery prevention
- **CORS Configuration** - Controlled cross-origin access
- **Input Validation** - Server-side validation
- **Error Handling** - Comprehensive error management

## Database Schema

The application uses SQLite with Entity Framework Core. Key entities:

- **Users** - User accounts and authentication
- **CoverLetters** - Generated cover letters
- **Payments** - Subscription and payment tracking

## Development

### Running Tests
```bash
cd backend
dotnet test
```

### Database Migrations
```bash
cd backend
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Building for Production
```bash
# Backend
cd backend
dotnet publish -c Release

# Frontend
cd frontend
npm run build
```

## Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `dotnet publish -c Release`
3. Deploy to your hosting platform (Azure, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting platform (Vercel, Netlify, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue on GitHub.

## Changelog

### Latest Version
- ✅ Complete migration to cookie-based authentication
- ✅ Fixed analytics display with proper data mapping
- ✅ Updated OpenAI model to gpt-4o-mini
- ✅ Improved error handling with detailed messages
- ✅ Enhanced security with comprehensive .gitignore
- ✅ All features working: cover letter generation, analytics, authentication 