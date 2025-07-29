# CoverLetterGen - AI-Powered Cover Letter Generator

A full-stack SaaS application that generates professional cover letters for remote jobs using GPT-4 technology.

## 🚀 Features

- **AI-Powered Generation**: Uses OpenAI GPT-4 for professional cover letter creation
- **Instant Results**: Generate cover letters in seconds
- **Customizable**: Tailored to your experience and job requirements
- **Export Options**: Copy to clipboard or download as PDF
- **Responsive Design**: Works on desktop and mobile devices
- **Monetization Ready**: Gumroad integration for premium features

## 🛠️ Tech Stack

### Backend
- **ASP.NET Core 8** - Web API
- **OpenAI .NET SDK** - GPT-4 integration
- **CORS** - Cross-origin resource sharing
- **Logging** - Comprehensive error handling

### Frontend
- **React 18** - User interface
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **jsPDF** - PDF generation

## 📦 Installation

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- OpenAI API key with sufficient quota

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
dotnet restore
```

3. Update the OpenAI API key in `appsettings.json`:
```json
{
  "OpenAI": {
    "ApiKey": "your-openai-api-key-here"
  }
}
```

4. Run the backend:
```bash
dotnet run
```

The backend will be available at `http://localhost:5026`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Configuration

### Backend Configuration

The backend is configured in `backend/appsettings.json`:

```json
{
  "OpenAI": {
    "ApiKey": "your-openai-api-key"
  },
  "CORS": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://your-vercel-domain.vercel.app"
    ]
  }
}
```

### Frontend Configuration

The frontend connects to the backend API. Update the API URL in `frontend/src/App.jsx` if needed:

```javascript
const response = await axios.post('http://localhost:5026/generate', formData)
```

## 🚀 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `dotnet build`
4. Set start command: `dotnet run`
5. Add environment variables:
   - `OpenAI__ApiKey`: Your OpenAI API key

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

## 💰 Monetization

The application includes Gumroad integration for premium features:

- **Free Tier**: Watermarked cover letters
- **Premium Tier**: Remove watermark, unlimited generations

Update the Gumroad link in `frontend/src/App.jsx`:
```javascript
href="https://gumroad.com/l/your-product-id?pro=true"
```

## 📁 Project Structure

```
CoverLetterGen/
├── backend/                 # ASP.NET Core Web API
│   ├── Program.cs          # Main application entry point
│   ├── GenerateRequest.cs  # Request model
│   ├── appsettings.json   # Configuration
│   └── backend.csproj     # Project file
├── frontend/               # React application
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Tailwind CSS
│   ├── package.json       # Dependencies
│   └── tailwind.config.js # Tailwind configuration
└── README.md              # This file
```

## 🔌 API Endpoints

### POST /generate

Generates a cover letter based on provided information.

**Request Body:**
```json
{
  "jobTitle": "Frontend Developer",
  "companyName": "Acme Corp",
  "userInfo": "3 years React experience, remote work background"
}
```

**Response:**
```json
{
  "coverLetter": "Dear Hiring Manager at Acme Corp..."
}
```

## 🎯 Usage

1. Fill in the job title, company name, and your experience
2. Click "Generate Cover Letter"
3. Review the generated cover letter
4. Copy to clipboard or download as PDF
5. Upgrade to remove watermark (optional)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for remote job seekers everywhere** 