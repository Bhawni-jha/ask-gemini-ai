// --- DOM Elements ---
const form = document.getElementById('queryForm');
const queryInput = document.getElementById('queryInput');
const responseText = document.getElementById('responseText');
const placeholderText = document.getElementById('placeholderText');
const submitButton = document.getElementById('submitButton');
const buttonText = document.getElementById('buttonText');
const spinner = document.getElementById('spinner');
const loadingIndicator = document.getElementById('loadingIndicator');
const responseArea = document.getElementById('responseArea');
const conversationIndicator = document.getElementById('conversationIndicator');
const conversationCount = document.getElementById('conversationCount');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// --- Conversation History ---
let conversationHistory = []; // Stores {role: 'user'|'model', text: '...'}

// --- Update conversation UI indicator ---
function updateConversationUI() {
    const turnCount = conversationHistory.filter(msg => msg.role === 'user').length;
    if (turnCount > 0) {
        conversationIndicator.classList.remove('hidden');
        conversationIndicator.classList.add('inline-flex');
        clearHistoryBtn.classList.remove('hidden');
        clearHistoryBtn.classList.add('inline-flex');
        conversationCount.textContent = turnCount;
    } else {
        conversationIndicator.classList.add('hidden');
        conversationIndicator.classList.remove('inline-flex');
        clearHistoryBtn.classList.add('hidden');
        clearHistoryBtn.classList.remove('inline-flex');
    }
}

// --- Clear conversation history ---
clearHistoryBtn.addEventListener('click', () => {
    conversationHistory = [];
    updateConversationUI();
    responseText.innerHTML = '';
    placeholderText.classList.remove('hidden');
});


// --- Quick Suggestions ---
document.querySelectorAll('.quick-suggestion').forEach(button => {
    button.addEventListener('click', () => {
        const question = button.textContent.trim().substring(2); // Remove emoji
        queryInput.value = question;
        queryInput.focus();
    });
});


// --- Auto-resize textarea ---
queryInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Allow Enter to submit, Shift+Enter for new line
queryInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
});


// --- Utility Functions ---

/**
 * Toggles the UI state between loading and idle.
 * @param {boolean} isLoading - True to show spinner and disable input, false otherwise.
 */
function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    queryInput.disabled = isLoading;
    // Show/hide the general loading message
    loadingIndicator.classList.toggle('hidden', !isLoading); 

    if (isLoading) {
        buttonText.classList.add('hidden');
        spinner.classList.remove('hidden');
    } else {
        buttonText.classList.remove('hidden');
        spinner.classList.add('hidden');
    }
}

/**
 * Converts basic Markdown text into HTML for display.
 * NOTE: This is a simplified parser and will struggle with deeply nested or complex MD.
 * @param {string} markdown - The raw markdown text from the AI.
 * @returns {string} - The processed HTML string.
 */
function renderMarkdown(markdown) {
    let html = markdown || '';
    
    // Simple blockquote
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1 italic text-gray-400">$1</blockquote>');
    
    // Code blocks (Must be done before other replacements like bold/italic)
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
        return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
    });
    
    // Headers (H2 and H3)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    
    // Inline code blocks (`...`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold text (**...**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Lists (Crude single-level list wrapper)
    // Find list items starting with '-'
    const listItems = html.match(/^- (.*$)/gim);
    if (listItems) {
        let listHtml = '<ul>';
        listItems.forEach(item => {
            // Remove the starting hyphen and wrap in <li>
            listHtml += `<li>${item.substring(2).trim()}</li>`;
        });
        listHtml += '</ul>';
        // Replace all list item lines with the single list block
        html = html.replace(/^- (.*$)/gim, '');
        // Find a suitable place to insert the list (often after a paragraph or at the start)
        if (html.trim().length === 0) {
            html = listHtml;
        } else {
             // Append to the end if not easily insertable
            html += listHtml; 
        }
    }
    
    // Replace multiple newlines with paragraphs, ensuring no double-wrap
    html = html.split('\n\n').map(p => {
        if (p.trim() === '' || p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<pre') || p.startsWith('<blockquote')) {
            return p;
        }
        // Replace single newlines within a block with <br>
        return `<p>${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('');

    return html;
}

// --- Event Handler ---

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = queryInput.value.trim();
    if (!query) return;

    // 1. Setup UI for loading
    responseText.innerHTML = '';
    placeholderText.classList.add('hidden');
    setLoading(true);

    try {
        // 2. Send request to the Express backend route with conversation history
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Send the user's question and conversation history to the Express server
            body: JSON.stringify({ 
                query: query,
                history: conversationHistory 
            }) 
        });

        const result = await response.json();

        // 3. Handle errors returned by the Express server
        if (!response.ok || result.error) {
             throw new Error(result.error || `Backend returned status ${response.status}`);
        }

        // 4. Update the UI with the successful response
        const { text, sources } = result;
        
        // Add current exchange to conversation history
        conversationHistory.push({ role: 'user', text: query });
        conversationHistory.push({ role: 'model', text: text });
        
        // Update conversation indicator
        updateConversationUI();

        // Render the main AI text with avatar
        const aiAvatar = `
            <div class="flex items-start gap-3 mb-4">
                <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-sm">🤖</span>
                </div>
                <div class="flex-1 min-w-0">
                    ${renderMarkdown(text)}
                </div>
            </div>
        `;
        responseText.innerHTML = aiAvatar;
        responseText.classList.add('fade-in');
        queryInput.value = ''; // Clear input
        queryInput.style.height = 'auto'; // Reset height

        // Display sources (citations) if the backend provided them
        if (sources && sources.length > 0) {
            let sourceHtml = '<div class="mt-8 pt-6 border-t border-gray-700/50 fade-in">';
            sourceHtml += '<div class="flex items-center gap-2 mb-4">';
            sourceHtml += '<svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>';
            sourceHtml += '<h4 class="text-sm font-semibold text-indigo-400">Sources & References</h4>';
            sourceHtml += '</div>';
            sourceHtml += '<div class="grid gap-2">';
            
            sources.forEach((source, index) => {
                sourceHtml += `
                    <a href="${source.uri}" target="_blank" rel="noopener noreferrer" 
                       class="group flex items-start gap-3 p-3 bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/50 rounded-lg transition-all duration-200 hover:border-indigo-500/30">
                        <span class="flex-shrink-0 w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center text-xs font-medium">
                            ${index + 1}
                        </span>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm text-gray-300 group-hover:text-indigo-300 transition-colors line-clamp-2">${source.title}</p>
                            <p class="text-xs text-gray-500 mt-1 truncate">${new URL(source.uri).hostname}</p>
                        </div>
                        <svg class="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </a>
                `;
            });
            sourceHtml += '</div></div>';
            responseText.innerHTML += sourceHtml;
        }
        
        // Smooth scroll to response
        responseArea.scrollTop = 0;

    } catch (error) {
        // 5. Display detailed error message to the user
        responseText.innerHTML = `
            <div class="bg-red-900/20 border border-red-700/50 p-4 rounded-xl fade-in">
                <div class="flex items-start gap-3">
                    <svg class="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="flex-1">
                        <h4 class="text-red-400 font-semibold mb-1">Request Failed</h4>
                        <p class="text-red-300 text-sm mb-2">${error.message}</p>
                        <p class="text-xs text-red-400/70">
                            Check your server console for details. If you see an API key error, verify your <code class="px-1.5 py-0.5 bg-red-900/30 rounded">.env</code> file and restart the server.
                        </p>
                    </div>
                </div>
            </div>
        `;
        responseText.classList.add('fade-in');
    } finally {
        // 6. Reset UI state
        setLoading(false);
    }
});
