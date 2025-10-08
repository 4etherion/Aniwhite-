// Global variables
let isAuthenticated = false;
let currentUser = null;
let chatHistory = [];

// DOM elements
const aiChatButton = document.getElementById('aiChatButton');
const aiChatPanel = document.getElementById('aiChatPanel');
const chatOverlay = document.getElementById('chatOverlay');
const chatClose = document.getElementById('chatClose');
const googleSignIn = document.getElementById('googleSignIn');
const authSection = document.getElementById('authSection');
const chatContent = document.getElementById('chatContent');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeGoogleAuth();
    setupChatInput();
});

// Event listeners
function initializeEventListeners() {
    // Chat button click
    aiChatButton.addEventListener('click', toggleChatPanel);
    
    // Close chat
    chatClose.addEventListener('click', closeChatPanel);
    
    // Overlay click to close in fullscreen mode
    chatOverlay.addEventListener('click', function(e) {
        if (e.target === chatOverlay) {
            closeChatPanel();
        }
    });
    
    // Google sign in
    googleSignIn.addEventListener('click', handleGoogleSignIn);
    
    // Send message
    sendMessage.addEventListener('click', handleSendMessage);
    
    // Enter key to send message
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // CTA button scroll to gallery
    document.querySelector('.cta-button').addEventListener('click', function() {
        document.querySelector('#gallery').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// Google Authentication
function initializeGoogleAuth() {
    // Simulate Google Auth initialization
    // In a real implementation, you would use Google's JavaScript SDK
    console.log('Google Auth initialized');
}

function handleGoogleSignIn() {
    // Simulate Google sign-in process
    // In a real implementation, you would use Google's authentication flow
    
    // Show loading state
    googleSignIn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    googleSignIn.disabled = true;
    
    // Simulate authentication delay
    setTimeout(() => {
        // Simulate successful authentication
        isAuthenticated = true;
        currentUser = {
            name: 'User',
            email: 'user@example.com',
            picture: 'https://via.placeholder.com/40'
        };
        
        // Hide auth section and show chat
        authSection.style.display = 'none';
        chatContent.style.display = 'flex';
        
        // Add welcome message
        addWelcomeMessage();
        
    }, 2000);
}

// Chat functionality
function toggleChatPanel() {
    const isActive = aiChatPanel.classList.contains('active');
    
    if (isActive) {
        closeChatPanel();
    } else {
        openChatPanel();
    }
}

function openChatPanel() {
    // Check screen size for fullscreen mode
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        aiChatPanel.classList.add('fullscreen');
        chatOverlay.classList.add('active');
    }
    
    aiChatPanel.classList.add('active');
    
    // Focus on input if authenticated
    if (isAuthenticated) {
        setTimeout(() => chatInput.focus(), 300);
    }
}

function closeChatPanel() {
    aiChatPanel.classList.remove('active', 'fullscreen');
    chatOverlay.classList.remove('active');
}

function setupChatInput() {
    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
}

function addWelcomeMessage() {
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'block';
    }
}

async function handleSendMessage() {
    if (!isAuthenticated) {
        alert('Please sign in to start chatting');
        return;
    }
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Disable send button and clear input
    sendMessage.disabled = true;
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Add user message
    addMessage(message, 'user');
    
    // Show thinking animation
    const thinkingElement = addThinkingMessage();
    
    // Simulate AI response
    try {
        const response = await generateAIResponse(message);
        
        // Remove thinking animation
        thinkingElement.remove();
        
        // Add AI response
        addMessage(response, 'ai');
        
    } catch (error) {
        // Remove thinking animation
        thinkingElement.remove();
        
        // Add error message
        addMessage('Sorry, I encountered an error. Please try again.', 'ai');
    }
    
    // Re-enable send button
    sendMessage.disabled = false;
    chatInput.focus();
}

function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Process markdown-like formatting
    const processedContent = processMarkdown(content);
    messageContent.innerHTML = processedContent;
    
    messageDiv.appendChild(messageContent);
    
    // Add copy button for AI messages
    if (type === 'ai') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
        copyBtn.onclick = () => copyToClipboard(content);
        
        actionsDiv.appendChild(copyBtn);
        messageDiv.appendChild(actionsDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    return messageDiv;
}

function addThinkingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message thinking-message';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content thinking-animation';
    messageContent.innerHTML = '<span class="shiny-text">Thinking</span><div class="loading-dots"><span></span><span></span><span></span></div>';
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    
    return messageDiv;
}

function processMarkdown(text) {
    // Basic markdown processing
    let processed = text;
    
    // Code blocks
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'text';
        return createCodeBlock(code.trim(), language);
    });
    
    // Inline code
    processed = processed.replace(/`([^`]+)`/g, '<code style="background: #f8f9fa; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>');
    
    // Bold text
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Headers
    processed = processed.replace(/^## (.*$)/gm, '<h3 style="color: #e91e63; margin: 1rem 0 0.5rem 0;">$1</h3>');
    processed = processed.replace(/^# (.*$)/gm, '<h2 style="color: #e91e63; margin: 1rem 0 0.5rem 0;">$1</h2>');
    
    // Line breaks
    processed = processed.replace(/\n/g, '<br>');
    
    return processed;
}

function createCodeBlock(code, language) {
    const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
    return `
        <div class="code-block">
            <div class="code-header">
                <span>${language}</span>
                <button class="code-copy-btn" onclick="copyCodeBlock('${codeId}')">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <div class="code-content">
                <pre id="${codeId}">${escapeHtml(code)}</pre>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyCodeBlock(codeId) {
    const codeElement = document.getElementById(codeId);
    if (codeElement) {
        copyToClipboard(codeElement.textContent);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show success feedback
        showCopyFeedback();
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyFeedback();
    });
}

function showCopyFeedback() {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = 'Copied!';
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #e91e63;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        z-index: 10000;
        font-size: 0.9rem;
        font-weight: 500;
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        document.body.removeChild(feedback);
    }, 2000);
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// AI Response Generation (Simulated)
async function generateAIResponse(userMessage) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
    
    // Simulate different types of responses based on user input
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('flower') || lowerMessage.includes('rose') || lowerMessage.includes('petal')) {
        return generateFlowerResponse(userMessage);
    } else if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
        return generateCodeResponse();
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return generateGreetingResponse();
    } else {
        return generateGeneralResponse(userMessage);
    }
}

function generateFlowerResponse(message) {
    const flowerResponses = [
        `🌸 **About Flowers**

Flowers are nature's most beautiful creations! They come in countless varieties, each with their own unique characteristics:

## Popular Flower Types:
- **Roses** 🌹 - Symbol of love and passion
- **Tulips** 🌷 - Represent perfect love and elegance  
- **Sunflowers** 🌻 - Radiate warmth and positivity
- **Cherry Blossoms** 🌸 - Fleeting beauty and precious moments

Did you know that flowers have been used throughout history to communicate emotions and messages? This practice is called **floriography** or the "language of flowers."

What specific flower would you like to learn more about?`,

        `🌺 **The Beauty of Flowers**

Flowers captivate us with their:
- **Vibrant colors** that brighten any space
- **Delicate fragrances** that evoke memories
- **Intricate patterns** found in their petals
- **Symbolic meanings** across different cultures

## Fun Flower Facts:
1. The largest flower in the world is the Rafflesia, which can grow up to 3 feet across!
2. Sunflowers can grow up to 30 feet tall
3. There are over 400,000 flowering plant species worldwide

Would you like to know more about flower care, meanings, or perhaps see our gallery?`,

        `🌼 **Flower Care & Appreciation**

Taking care of flowers is both an art and a science:

## Basic Flower Care:
- **Water regularly** but don't overwater
- **Provide adequate sunlight** based on the species
- **Use quality soil** with proper drainage
- **Prune dead flowers** to encourage new growth

Flowers bring joy not just through their beauty, but also through the process of nurturing them. There's something deeply satisfying about watching a seed grow into a beautiful bloom.

Are you interested in growing your own flowers, or would you like tips for arranging cut flowers?`
    ];
    
    return flowerResponses[Math.floor(Math.random() * flowerResponses.length)];
}

function generateCodeResponse() {
    return `💻 **Code Example - Flower Animation**

Here's a simple CSS animation for a flower petal effect:

\`\`\`css
.petal {
    width: 20px;
    height: 40px;
    background: linear-gradient(45deg, #e91e63, #f06292);
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    transform-origin: bottom center;
    animation: bloom 2s ease-in-out infinite;
}

@keyframes bloom {
    0% { transform: rotate(0deg) scale(0.8); }
    50% { transform: rotate(10deg) scale(1.1); }
    100% { transform: rotate(0deg) scale(0.8); }
}
\`\`\`

This creates a gentle blooming animation! You can use multiple petals with different rotation angles to create a full flower effect.

Would you like to see more flower-themed code examples?`;
}

function generateGreetingResponse() {
    const greetings = [
        `Hello! 🌸 Welcome to Flower! I'm here to help you discover the wonderful world of flowers. I can tell you about different flower types, their meanings, care tips, or we can chat about anything else you'd like to know!

What brings you to our flower garden today?`,

        `Hi there! 🌺 I'm Flower-1 Max, your AI companion for all things beautiful and natural. Whether you want to learn about flowers, need gardening advice, or just want to have a friendly conversation, I'm here for you!

How can I brighten your day?`,

        `Greetings! 🌷 It's wonderful to meet you! I'm passionate about flowers and nature, but I'm also here to help with any questions or topics you'd like to explore. 

What would you like to talk about today?`
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
}

function generateGeneralResponse(message) {
    const responses = [
        `That's an interesting topic! I'd be happy to help you with that. 

While I specialize in flowers and nature, I can discuss a wide range of subjects. Could you tell me more about what specifically you'd like to know?

## I can help with:
- **Flower identification** and care
- **Gardening tips** and advice  
- **General questions** on various topics
- **Creative projects** and ideas

What would you like to explore?`,

        `Thank you for your question! I'm here to provide helpful information on any topic you're curious about.

Whether it's about our beautiful flower website, gardening, nature, or something completely different, I'll do my best to give you a thoughtful and informative response.

Could you provide a bit more detail about what you're looking for? I want to make sure I give you the most helpful answer possible! 🌸`,

        `I appreciate you reaching out! As your AI assistant, I'm equipped to discuss a variety of topics and provide helpful information.

## What I can help with:
- **Questions about flowers** and this website
- **General knowledge** on many subjects
- **Problem-solving** and advice
- **Creative inspiration** and ideas

Feel free to ask me anything - I'm here to help make your experience as pleasant as possible! 🌼`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Responsive handling
window.addEventListener('resize', function() {
    if (aiChatPanel.classList.contains('active')) {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && !aiChatPanel.classList.contains('fullscreen')) {
            aiChatPanel.classList.add('fullscreen');
            chatOverlay.classList.add('active');
        } else if (!isMobile && aiChatPanel.classList.contains('fullscreen')) {
            aiChatPanel.classList.remove('fullscreen');
            chatOverlay.classList.remove('active');
        }
    }
});

// Smooth header background on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    // Subtle parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const rect = hero.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            hero.style.background = `linear-gradient(135deg, #ffffff 0%, #fce4ec 50%, #f8d7da 100%)`;
        }
    }
});

// Initialize animations when elements come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.gallery-item, .feature, .flower-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});