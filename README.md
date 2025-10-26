# 🤖 Ask Gemini AI - Full Stack Application# Ask Gemini - Full Stack AI App# Ask Gemini



A beautiful, modern full-stack web application powered by Google's Gemini AI with real-time Google Search grounding. Features conversation memory, glass morphism UI, and seamless AI interactions.



![Ask Gemini AI](https://img.shields.io/badge/AI-Gemini%202.5-blue?style=for-the-badge&logo=google)A minimal web app that demonstrates a secure backend calling the Gemini API and a simple frontend to ask questions.A minimal web app that demonstrates a secure backend calling the Gemini API and a simple frontend to ask questions.

![Node.js](https://img.shields.io/badge/Node.js-v24+-green?style=for-the-badge&logo=node.js)

![Express](https://img.shields.io/badge/Express-4.x-lightgrey?style=for-the-badge&logo=express)



## ✨ Features## FeaturesFeatures



- 🎨 **Modern Glass Morphism UI** - Beautiful animated gradient background with glassmorphic effects- ✅ Frontend: Beautiful dark theme UI with Tailwind CSS- Frontend: `public/index.html` + `public/app.js` — enter a question and view the answer.

- 💬 **Conversation Memory** - AI remembers previous messages for context-aware responses

- 🔍 **Google Search Grounding** - Real-time web search for up-to-date information- ✅ Backend: Express.js server that securely calls Gemini API- Backend: `server.js` — receives requests from the frontend and calls the Gemini API securely (API key kept on server).

- 🚀 **Quick Suggestions** - Pre-built prompts for instant queries

- 📱 **Fully Responsive** - Works beautifully on mobile, tablet, and desktop- ✅ Markdown rendering for formatted responses- Dev mode: set `MOCK=true` in `.env` to return fake responses for local development without a real key.

- 🎭 **Loading Animations** - Smooth shimmer effects and transitions

- 📚 **Source Citations** - Beautiful cards showing reference sources- ✅ Loading indicators and error handling

- 🔒 **Secure Backend** - API key protection with Express.js proxy

- ⌨️ **Smart Input** - Auto-resize textarea, Enter to send, Shift+Enter for new line- ✅ Google Search grounding for up-to-date informationSetup

- 🗑️ **Clear Chat** - Reset conversation history anytime

1. Install dependencies:

## 🚀 Quick Start

## Quick Start

### Prerequisites

   npm install

- Node.js v18+ (built-in fetch support)

- Google Gemini API key ([Get it free here](https://aistudio.google.com/app/apikey))### Method 1: Using the helper script (Recommended)



### Installation```bash2. Create a `.env` file at the project root (copy from `.env.example`):



1. **Clone the repository**./start.sh

   ```bash

   git clone https://github.com/yourusername/ask-gemini-ai.git```   cp .env.example .env

   cd ask-gemini-ai

   ```This automatically handles port conflicts and starts the server.   # then edit .env and set GEMINI_API_KEY when you have it



2. **Install dependencies**

   ```bash

   npm install### Method 2: Manual start3. Start the server:

   ```

```bash

3. **Set up environment variables**

   ```bash# Make sure no other server is running on port 3000   npm start

   cp .env.example .env

   ```pkill -f "node.*server.js"

   

   Edit `.env` and add your Gemini API key:4. Open http://localhost:3000 in your browser.

   ```

   GEMINI_API_KEY=your_actual_api_key_here# Start the server

   PORT=4000

   ```npm startNotes



4. **Start the server**```- All communication with Gemini happens on the backend (`server.js`). Do not place your API key in frontend code.

   ```bash

   npm start- If you don't have a key yet, set `MOCK=true` in `.env` to enable a local mock response for development.

   ```

### Method 3: Use a different port

5. **Open in browser**

   ``````bashNext steps you might want me to implement:

   http://localhost:4000

   ```PORT=4000 npm start- Add a small E2E test to validate server & frontend.



## 📁 Project Structure```- Add a `.env.example` check during startup and a nicer dev-mode UI.



```

ask-gemini-ai/Then open http://localhost:3000 (or your chosen port) in your browser!

├── server.js           # Express backend with API proxy

├── package.json        # Dependencies and scripts## Setup (First Time Only)

├── .env               # Environment variables (not in git)

├── .env.example       # Example environment file1. Install dependencies:

├── public/   ```bash

│   ├── index.html     # Frontend UI with glass morphism   npm install

│   └── app.js         # Frontend logic and conversation handling   ```

└── README.md          # This file

```2. Your `.env` file is already configured with the Gemini API key.



## 🎯 How to Use3. Start the server (see Quick Start above)



1. **Ask Questions** - Type any question in the input field4. Open http://localhost:3000 in your browser

2. **Use Quick Suggestions** - Click pre-built prompts for instant queries

3. **Follow-up Questions** - AI remembers context from previous messages## Common Issues

4. **View Sources** - Scroll down to see reference links

5. **Clear Chat** - Click "Clear Chat" to start a fresh conversation### "Port already in use" error or "nodemon crashed"

This happens when another server is already running on port 3000.

### Example Conversations

**Solution 1:** Use the start script (handles this automatically)

**Simple Query:**```bash

```./start.sh

You: What are the latest AI developments?```

AI: [Provides detailed answer with sources]

```**Solution 2:** Kill the existing process

```bash

**Context-Aware:**pkill -f "node.*server.js"

```npm start

You: My favorite programming language is Python```

AI: Python is a great choice! It's versatile and easy to learn.

**Solution 3:** Use a different port

You: What frameworks can I use with it?```bash

AI: For Python, popular frameworks include Django, Flask... [remembers Python context]PORT=4000 npm start

``````



## 🛠️ Tech Stack**Solution 4:** Find and kill specific process

```bash

### Backendlsof -i :3000 -sTCP:LISTEN -Pn

- **Node.js v24+** - Built-in fetch supportkill <PID>

- **Express.js** - Web server and API routing```

- **dotenv** - Environment variable management

- **Google Gemini API** - AI model (gemini-2.5-flash-preview)## Testing



### FrontendTest the API endpoint directly:

- **Vanilla JavaScript** - No frameworks, pure performance```bash

- **Tailwind CSS** - Utility-first styling via CDNcurl -X POST http://localhost:3000/api/generate \

- **Google Fonts (Inter)** - Modern typography  -H 'Content-Type: application/json' \

- **Glass Morphism** - Backdrop filters and gradients  -d '{"query":"What is AI?"}'

```

## 📝 API Endpoints

Check if server is running:

### POST `/api/generate````bash

curl http://localhost:3000/

Generate AI response with conversation history.```



**Request Body:**## Project Structure

```json

{```

  "query": "What is AI?",gemini-int/

  "history": [├── .env                    # Your Gemini API key (secure)

    {"role": "user", "text": "Hello"},├── package.json            # Dependencies and scripts

    {"role": "model", "text": "Hi! How can I help?"}├── server.js              # Express backend

  ]├── start.sh               # Helper script to start server

}├── public/

```│   ├── index.html         # Frontend UI

│   └── app.js             # Frontend JavaScript

**Response:**└── README.md              # This file

```json```

{

  "text": "AI is artificial intelligence...",## How It Works

  "sources": [

    {1. **Frontend (public/)**: User types a question in the browser

      "uri": "https://example.com",2. **HTTP Request**: Frontend sends POST request to `/api/generate`

      "title": "What is AI?"3. **Backend (server.js)**: Receives request and calls Gemini API with your secure API key

    }4. **Gemini API**: Processes the question and returns AI-generated answer

  ]5. **Backend**: Sends response back to frontend

}6. **Frontend**: Displays the formatted answer to the user

```

## Security Notes

## 🔧 Configuration- ✅ API key is stored in `.env` file (never committed to git)

- ✅ All Gemini API calls happen on the backend

### Environment Variables- ✅ Frontend never exposes the API key

- ✅ Error handling prevents information leakage

| Variable | Required | Default | Description |

|----------|----------|---------|-------------|## Tech Stack

| `GEMINI_API_KEY` | Yes | - | Your Google Gemini API key |- **Backend**: Node.js, Express.js

| `PORT` | No | 4000 | Server port number |- **Frontend**: Vanilla JavaScript, Tailwind CSS

- **AI**: Google Gemini API with Search grounding

### Customization- **Dev Tools**: Nodemon for auto-reload during development



**Change AI Model:**## Need Help?

Edit `server.js`, line 11:

```javascriptIf you're still having issues:

const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";1. Make sure you're in the correct directory: `/home/navgurukul/Desktop/gemini/gemini-int`

```2. Check if port 3000 is free: `lsof -i :3000`

3. Verify Node.js version: `node --version` (should be 18+)

**Modify System Prompt:**4. Check the `.env` file exists and has `GEMINI_API_KEY` set

Edit `server.js`, line 40:
```javascript
const systemPrompt = "You are a concise, helpful, and friendly AI assistant...";
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill existing server
pkill -f "node.*server.js"

# Or use different port
PORT=5000 npm start
```

### API Key Error
- Check `.env` file exists and has valid key
- Restart server after adding/changing API key
- Get new key at https://aistudio.google.com/app/apikey

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for the powerful language model
- Tailwind CSS for the beautiful styling utilities
- The open-source community for inspiration

## 📞 Support

If you have any questions or issues:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section

---

Made with ❤️ using Google Gemini AI

⭐ Star this repo if you find it helpful!
