# GovSense

**GovSense** is a web-based platform that classifies text and images as constructive criticism, neutral content, hate speech, or unrelated content directed toward government institutions. Powered by Google Gemini AI.

---

## 🚀 Features

- **Text Classification**: Analyze sentences or paragraphs for sentiment
- **Image Classification**: Upload images to detect visual content and text
- **Real-time Analysis**: Get instant results with confidence scores
- **Dark Mode**: Toggle between light and dark themes
- **Export Results**: Download analysis results as JSON
- **Responsive Design**: Works on desktop, tablet, and mobile devices

---

## 📋 Prerequisites

Before running this application, ensure you have:

- **Python 3.11+** (for backend)
- **Node.js 18+** and **npm** (for frontend)
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd GovSense
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp ../.env.example .env

# Edit .env file and add your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
# The frontend will use http://localhost:8000 by default
```

---

## ▶️ Running the Application

### Start Backend Server

```bash
# In the backend directory with activated virtual environment
cd backend
python main.py
```

The backend API will start at: `http://localhost:8000`

### Start Frontend Development Server

```bash
# In a new terminal, navigate to frontend directory
cd frontend
npm start
```

The frontend will open automatically at: `http://localhost:3000`

---

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoints

#### 1. Classify Text
```http
POST /classify_text
Content-Type: application/json

{
  "text": "The government should improve public transportation."
}
```

**Response:**
```json
{
  "classification": "constructive",
  "confidence": 0.92,
  "explanation": "The statement proposes improvements without insulting or threatening.",
  "raw_output": "...",
  "timestamp": "2025-03-10T14:22:00Z"
}
```

#### 2. Classify Image
```http
POST /classify_image
Content-Type: multipart/form-data

file: (image file .jpg or .png)
```

**Response:**
```json
{
  "classification": "hate_speech",
  "confidence": 0.87,
  "explanation": "Image contains slurs directed at government officials.",
  "timestamp": "2025-03-10T14:25:10Z"
}
```

---

## 🎨 Usage Guide

1. **Choose Mode**: Select either Text Mode or Image Mode
2. **Input Content**: 
   - Text Mode: Type or paste text (up to 2000 characters)
   - Image Mode: Drag & drop or browse for an image (JPG/PNG, max 5MB)
3. **Analyze**: Click the "Analyze" button
4. **View Results**: See classification, confidence score, and AI explanation
5. **Export**: Download results as JSON if needed

---

## 📁 Project Structure

```
GovSense/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html       # HTML template
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Header.js
│   │   │   ├── TextMode.js
│   │   │   ├── ImageMode.js
│   │   │   ├── ResultCard.js
│   │   │   ├── ErrorModal.js
│   │   │   └── LoadingSpinner.js
│   │   ├── App.js           # Main application
│   │   ├── index.js         # Entry point
│   │   └── index.css        # Tailwind CSS
│   ├── package.json         # Node dependencies
│   ├── tailwind.config.js   # Tailwind configuration
│   └── postcss.config.js    # PostCSS configuration
├── .env.example             # Environment variables template
└── readme.md                # This file
```

---

## 🔒 Security Notes

- **Never commit** your `.env` file with actual API keys
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Validate all user inputs on both frontend and backend
- Consider implementing user authentication for production use

---

## 🚀 Deployment

### Backend Deployment Options

- **Heroku**: Use `Procfile` with `web: uvicorn main:app --host=0.0.0.0 --port=${PORT:-8000}`
- **Google Cloud Run**: Containerize with Docker
- **AWS Lambda**: Use Mangum for serverless deployment
- **Railway/Render**: Direct deployment with `requirements.txt`

### Frontend Deployment Options

- **Vercel**: Connect GitHub repo and deploy automatically
- **Netlify**: Drag & drop build folder or connect repo
- **GitHub Pages**: Build and deploy static files
- **Firebase Hosting**: Use Firebase CLI

---

## 🧪 Testing

### Test Backend Endpoints

```bash
# Health check
curl http://localhost:8000/

# Test text classification
curl -X POST http://localhost:8000/classify_text \
  -H "Content-Type: application/json" \
  -d '{"text":"The government needs better policies"}'

# Test image classification
curl -X POST http://localhost:8000/classify_image \
  -F "file=@path/to/image.jpg"
```

---

## 🛣️ Roadmap

- [ ] Batch processing for multiple inputs
- [ ] User accounts and moderation dashboards
- [ ] Analytics and reporting features
- [ ] Multilingual support
- [ ] Fine-tuned custom prompts
- [ ] PDF report generation
- [ ] Historical analysis tracking

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using FastAPI, React, and Google Gemini AI**
