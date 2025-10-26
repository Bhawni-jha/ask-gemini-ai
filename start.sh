#!/bin/bash
# Start script for Ask Gemini - Handles port conflicts automatically

echo "🚀 Starting Ask Gemini server..."

# Check if port 3000 is in use
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 3000 is already in use"
    echo "🔄 Stopping existing server..."
    pkill -f "node.*server.js" || true
    sleep 0.5
fi

# Navigate to the correct directory
cd "$(dirname "$0")"

# Start the server
echo "✨ Starting server on port 3000..."
npm start
