// Load environment variables from the .env file (for GEMINI_API_KEY)
require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// --- Configuration & Security ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const API_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

// --- Middleware ---
// 1. Serve static files (index.html, app.js, etc.) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); 
// 2. Middleware to parse incoming JSON payloads (to read the 'query' from the frontend)
app.use(express.json());

// --- Core API Route ---
// This POST endpoint handles the user's question sent from the frontend
app.post('/api/generate', async (req, res) => {
    // 1. Get user input and conversation history
    const userQuery = req.body.query;
    const conversationHistory = req.body.history || []; // Array of previous {role, text} messages

    if (!userQuery) {
        return res.status(400).json({ error: 'Query is required in the request body.' });
    }
    
    // 2. Security Check: Ensure the API key is present
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "") {
        console.error("API Key missing! Please check the .env file.");
        return res.status(500).json({ 
            error: "Server Error: Gemini API Key is missing. Please set it in your .env file and restart the server.",
            text: "Mocked response: Key missing. Cannot call live API."
        });
    }

    try {
        const systemPrompt = "You are a concise, helpful, and friendly AI assistant. Always format your response using Markdown for excellent readability.";

        // 3. Build contents array with conversation history
        const contents = [];
        
        // Add previous conversation turns
        conversationHistory.forEach(msg => {
            contents.push({
                role: msg.role, // 'user' or 'model'
                parts: [{ text: msg.text }]
            });
        });
        
        // Add current user query
        contents.push({
            role: 'user',
            parts: [{ text: userQuery }]
        });

        // 4. Construct the Gemini API payload
        const payload = {
            contents: contents,
            // Enable Google Search grounding tool for up-to-date answers
            tools: [{ "google_search": {} }], 
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
        };

        // 4. Securely call the external Gemini API
        const apiResponse = await fetch(`${API_BASE_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // 5. Handle non-OK response from Gemini API
        if (!apiResponse.ok) {
            const errorBody = await apiResponse.json();
            console.error("Gemini API returned an error:", errorBody);
            throw new Error(`External API failed with status ${apiResponse.status}`);
        }

        const result = await apiResponse.json();
        
        // 6. Process the successful response
        const candidate = result.candidates?.[0];
        let aiText = "Could not generate or parse AI response.";
        let sources = [];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            aiText = candidate.content.parts[0].text;
            
            // Extract grounding sources (citations)
            const groundingMetadata = candidate.groundingMetadata;
            if (groundingMetadata && groundingMetadata.groundingAttributions) {
                // Collect valid, unique sources
                sources = Array.from(new Map(
                    groundingMetadata.groundingAttributions
                        .filter(attr => attr.web && attr.web.uri && attr.web.title)
                        .map(attr => [attr.web.uri, { uri: attr.web.uri, title: attr.web.title }])
                ).values());
            }
        }

        // 7. Send the final text and sources back to the frontend
        res.json({ text: aiText, sources: sources });

    } catch (error) {
        console.error("Server-side processing error:", error.message);
        res.status(500).json({ error: 'Failed to communicate with the AI model or process the response.' });
    }
});


// --- Server Start ---
const server = app.listen(PORT, () => {
    console.log(`✅ Ask Gemini server running on http://localhost:${PORT}`);
    console.log(`📝 Open the URL in your browser to use the app!`);
});

// Handle server errors gracefully
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ ERROR: Port ${PORT} is already in use!`);
        console.error(`\n💡 Solutions:`);
        console.error(`   1. Stop the other server: pkill -f "node.*server.js"`);
        console.error(`   2. Use a different port: PORT=4000 npm start`);
        console.error(`   3. Find the process: lsof -i :${PORT}\n`);
        process.exit(1);
    } else if (err.code === 'EACCES') {
        console.error(`\n❌ ERROR: Permission denied to bind to port ${PORT}`);
        console.error(`💡 Try using a port >= 1024 or run with sudo (not recommended)\n`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
});
