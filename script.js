// Global variables
let isAuthenticated = false;
let userInfo = null;

// Initialize Google Sign In
window.onload = function() {
    // Initialize marked options for markdown
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true
    });

    // Check if user is already authenticated
    checkAuthStatus();
    
    // Initialize event listeners
    initializeEventListeners();
};

// Initialize all event listeners
function initializeEventListeners() {
    // AI Chat button
    const aiChatBtn = document.getElementById('aiChatBtn');
    const aiChatPanel = document.getElementById('aiChatPanel');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatOverlay = document.querySelector('.chat-overlay');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const googleSignIn = document.getElementById('googleSignIn');

    // Open chat panel
    aiChatBtn.addEventListener('click', () => {
        if (!isAuthenticated) {
            alert('Please sign in with Google to use the AI chat feature.');
            return;
        }
        aiChatPanel.classList.add('active');
    });

    // Close chat panel
    closeChatBtn.addEventListener('click', () => {
        aiChatPanel.classList.remove('active');
    });

    // Close on overlay click
    chatOverlay.addEventListener('click', () => {
        aiChatPanel.classList.remove('active');
    });

    // Send message
    sendBtn.addEventListener('click', sendMessage);

    // Send on Enter, new line on Shift+Enter
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    // Google Sign In
    googleSignIn.addEventListener('click', handleGoogleSignIn);

    // Smooth scrolling for navigation
    document.querySelectorAll('.nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Check authentication status
function checkAuthStatus() {
    const storedAuth = localStorage.getItem('flowerAuth');
    if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        isAuthenticated = true;
        userInfo = authData;
        updateUIForAuth();
    }
}

// Handle Google Sign In
async function handleGoogleSignIn() {
    // For demo purposes, we'll simulate a successful sign in
    // In production, you would integrate with actual Google OAuth
    
    // Simulate authentication
    isAuthenticated = true;
    userInfo = {
        name: 'User',
        email: 'user@example.com',
        picture: ''
    };
    
    // Store auth info
    localStorage.setItem('flowerAuth', JSON.stringify(userInfo));
    
    updateUIForAuth();
    alert('Successfully signed in! You can now use the AI chat.');
}

// Update UI after authentication
function updateUIForAuth() {
    const googleSignIn = document.getElementById('googleSignIn');
    if (isAuthenticated) {
        googleSignIn.textContent = 'Sign Out';
        googleSignIn.removeEventListener('click', handleGoogleSignIn);
        googleSignIn.addEventListener('click', handleSignOut);
    }
}

// Handle Sign Out
function handleSignOut() {
    isAuthenticated = false;
    userInfo = null;
    localStorage.removeItem('flowerAuth');
    
    const googleSignIn = document.getElementById('googleSignIn');
    googleSignIn.textContent = 'Sign in with Google';
    googleSignIn.removeEventListener('click', handleSignOut);
    googleSignIn.addEventListener('click', handleGoogleSignIn);
    
    // Close chat if open
    document.getElementById('aiChatPanel').classList.remove('active');
    
    alert('Successfully signed out!');
}

// Send message to AI
async function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Show thinking indicator
    const thinkingId = showThinkingIndicator();
    
    // Simulate AI response (in production, this would call your backend API)
    setTimeout(() => {
        removeThinkingIndicator(thinkingId);
        const response = generateAIResponse(message);
        addMessageToChat(response, 'ai');
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
}

// Add message to chat
function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (sender === 'ai') {
        // Parse markdown for AI messages
        contentDiv.innerHTML = marked.parse(message);
        
        // Add copy buttons to code blocks
        contentDiv.querySelectorAll('pre').forEach(pre => {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.onclick = () => copyCode(pre.querySelector('code').textContent);
            pre.appendChild(copyBtn);
        });
        
        // Add copy message button
        const copyMessageBtn = document.createElement('button');
        copyMessageBtn.className = 'copy-message-btn';
        copyMessageBtn.textContent = 'Copy Message';
        copyMessageBtn.onclick = () => copyMessage(message);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(copyMessageBtn);
    } else {
        contentDiv.textContent = message;
        messageDiv.appendChild(contentDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show thinking indicator
function showThinkingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const thinkingDiv = document.createElement('div');
    const id = 'thinking-' + Date.now();
    thinkingDiv.id = id;
    thinkingDiv.className = 'message ai-message';
    thinkingDiv.innerHTML = `
        <div class="thinking-indicator">
            <span class="shiny-text">Thinking</span>
        </div>
    `;
    chatMessages.appendChild(thinkingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return id;
}

// Remove thinking indicator
function removeThinkingIndicator(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

// Generate AI response (simulated)
function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Flower-related responses
    if (lowerMessage.includes('rose')) {
        return `## About Roses 🌹\n\nRoses are one of the most beloved flowers in the world! They come in various colors, each with its own meaning:\n\n- **Red roses** symbolize love and passion\n- **White roses** represent purity and innocence\n- **Pink roses** convey gratitude and admiration\n- **Yellow roses** express friendship and joy\n\nRoses have been cultivated for over 5,000 years and are featured prominently in art, literature, and culture throughout history.\n\n\`\`\`javascript\n// Fun fact about roses\nconst roseFact = {\n  petals: "30-50 per flower",\n  species: "Over 150 species",\n  fragrance: "Used in perfumes worldwide"\n};\n\`\`\``;
    } else if (lowerMessage.includes('lily') || lowerMessage.includes('lilies')) {
        return `## Beautiful Lilies 🌺\n\nLilies are elegant flowers that have captivated people for centuries. They're known for:\n\n1. **Symbolism**: Different cultures associate lilies with rebirth, motherhood, and purity\n2. **Varieties**: Over 90 species exist worldwide\n3. **Colors**: From pure white to vibrant orange and deep purple\n\n*Did you know?* Some lily species can grow up to 6 feet tall!`;
    } else if (lowerMessage.includes('tulip')) {
        return `## Tulips - Spring's Messengers 🌷\n\nTulips are fascinating flowers with a rich history:\n\n- Originally from Central Asia\n- Became incredibly valuable in 17th century Holland during "Tulip Mania"\n- Over 3,000 registered varieties exist today\n- They continue to grow after being cut, up to an inch or more!\n\n**Fun fact**: The Netherlands produces about 3 billion tulip bulbs annually!`;
    } else if (lowerMessage.includes('care') || lowerMessage.includes('grow')) {
        return `## Flower Care Tips 🌻\n\nHere are essential tips for caring for flowers:\n\n### Cut Flowers:\n1. **Fresh water** - Change every 2-3 days\n2. **Clean vase** - Prevents bacterial growth\n3. **Trim stems** - Cut at an angle for better water absorption\n4. **Cool location** - Away from direct sunlight and heat\n\n### Garden Flowers:\n\`\`\`markdown\n- Water early morning or evening\n- Provide adequate drainage\n- Remove dead blooms (deadheading)\n- Use appropriate fertilizer\n- Consider companion planting\n\`\`\``;
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return `# Welcome to Flower-1 Max! 🌸\n\nHello! I'm here to help you explore the wonderful world of flowers. I can assist you with:\n\n- Information about different flower species\n- Gardening tips and care instructions\n- Flower symbolism and meanings\n- Floral arrangement ideas\n- And much more!\n\nWhat would you like to know about flowers today?`;
    } else if (lowerMessage.includes('website') || lowerMessage.includes('flower website')) {
        return `## About the Flower Website 🌼\n\nThis beautiful website is dedicated to celebrating the beauty of flowers! Created by **Aetherion**, it features:\n\n- **Elegant Design**: Soft pink tones on a clean white background\n- **Flower Gallery**: Showcasing various flower types\n- **Interactive AI Chat**: Powered by advanced AI technology\n- **Responsive Layout**: Perfect on any device\n\n### Creator Information:\n- Discord: \`4etherion_\`\n- Instagram: \`@karabukdengeldik\`\n\nFeel free to explore and learn about the amazing world of flowers!`;
    } else {
        // Default response for other topics
        return `## ${message.charAt(0).toUpperCase() + message.slice(1)} 🌺\n\nThat's an interesting topic! While my specialty is flowers and this beautiful website, I'm happy to discuss various subjects.\n\nIf you'd like to know about flowers, I can share information about:\n- Different flower species and their characteristics\n- How to grow and care for flowers\n- Flower meanings and symbolism\n- The role of flowers in nature and ecosystems\n\nOr we can continue discussing **${message}**. What specific aspect would you like to explore?`;
    }
}

// Copy code to clipboard
function copyCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        // Show temporary success message
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Copy message to clipboard
function copyMessage(message) {
    navigator.clipboard.writeText(message).then(() => {
        // Show temporary success message
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}