// AI Chat Application
class FlowerAI {
    constructor() {
        this.isAuthenticated = false;
        this.user = null;
        this.conversationHistory = [];
        this.initializeElements();
        this.attachEventListeners();
        this.systemPrompt = `You are Flower-1 Max, an advanced AI assistant integrated into the Flower website. You are knowledgeable about flowers, plants, nature, and can discuss any topic. You have detailed information about the Flower website, which showcases the beauty of flowers with an elegant design featuring white backgrounds and light pink tones. The website includes a gallery of beautiful flowers like roses, tulips, cherry blossoms, lilies, peonies, and orchids. You are helpful, friendly, and provide detailed, accurate information. Always format your responses using markdown for better readability.`;
    }

    initializeElements() {
        this.chatButton = document.getElementById('aiChatButton');
        this.chatPanel = document.getElementById('aiChatPanel');
        this.closeButton = document.getElementById('closeChat');
        this.chatOverlay = document.getElementById('chatOverlay');
        this.authContainer = document.getElementById('authContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInputContainer = document.getElementById('chatInputContainer');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.googleSignInButton = document.getElementById('googleSignIn');
    }

    attachEventListeners() {
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.closeButton.addEventListener('click', () => this.closeChat());
        this.chatOverlay.addEventListener('click', () => this.closeChat());
        this.googleSignInButton.addEventListener('click', () => this.handleGoogleSignIn());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.chatInput.addEventListener('input', () => {
            this.chatInput.style.height = 'auto';
            this.chatInput.style.height = this.chatInput.scrollHeight + 'px';
        });
    }

    toggleChat() {
        const isActive = this.chatPanel.classList.contains('active');
        
        if (!isActive) {
            this.chatPanel.classList.add('active');
            
            // On desktop, make it fullscreen
            if (window.innerWidth >= 769) {
                this.chatPanel.classList.add('fullscreen');
                this.chatOverlay.classList.add('active');
            }
        } else {
            this.closeChat();
        }
    }

    closeChat() {
        this.chatPanel.classList.remove('active');
        this.chatPanel.classList.remove('fullscreen');
        this.chatOverlay.classList.remove('active');
    }

    handleGoogleSignIn() {
        // Simulate Google sign-in for demo purposes
        // In production, implement actual Google OAuth
        this.isAuthenticated = true;
        this.user = {
            name: 'User',
            email: 'user@example.com'
        };
        this.showChatInterface();
    }

    showChatInterface() {
        this.authContainer.style.display = 'none';
        this.chatMessages.style.display = 'flex';
        this.chatInputContainer.style.display = 'flex';
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';

        // Scroll to bottom
        this.scrollToBottom();

        // Show thinking indicator
        const thinkingMessage = this.addThinkingMessage();

        // Simulate AI response (replace with actual API call)
        const response = await this.getAIResponse(message);
        
        // Remove thinking message
        thinkingMessage.remove();

        // Add AI response
        this.addMessage(response, 'ai');
        this.scrollToBottom();
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        if (type === 'ai') {
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            
            // Parse markdown
            const parsedContent = this.parseMarkdown(content);
            messageContent.innerHTML = parsedContent;
            
            messageDiv.appendChild(messageContent);

            // Add copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', () => this.copyMessage(content, copyBtn));
            messageDiv.appendChild(copyBtn);

            // Add copy buttons to code blocks
            setTimeout(() => {
                const codeBlocks = messageDiv.querySelectorAll('pre');
                codeBlocks.forEach(block => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'code-block-wrapper';
                    block.parentNode.insertBefore(wrapper, block);
                    wrapper.appendChild(block);

                    const copyCodeBtn = document.createElement('button');
                    copyCodeBtn.className = 'code-copy-btn';
                    copyCodeBtn.textContent = 'Copy Code';
                    copyCodeBtn.addEventListener('click', () => {
                        const code = block.textContent;
                        this.copyToClipboard(code, copyCodeBtn);
                    });
                    wrapper.appendChild(copyCodeBtn);
                });
            }, 100);
        } else {
            messageDiv.textContent = content;
        }

        this.chatMessages.appendChild(messageDiv);
        return messageDiv;
    }

    addThinkingMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai';
        
        const thinkingText = document.createElement('span');
        thinkingText.className = 'thinking';
        thinkingText.textContent = 'Thinking';
        
        messageDiv.appendChild(thinkingText);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        return messageDiv;
    }

    parseMarkdown(text) {
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true
            });
            return marked.parse(text);
        }
        
        // Fallback simple markdown parser
        let html = text;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Code blocks
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Line breaks
        html = html.replace(/\n/g, '<br>');
        
        return html;
    }

    copyMessage(content, button) {
        // Remove markdown formatting for plain text copy
        const plainText = content.replace(/[#*`]/g, '');
        this.copyToClipboard(plainText, button);
    }

    copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    async getAIResponse(userMessage) {
        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        // Simulate API call with intelligent responses
        const response = await this.generateResponse(userMessage);
        
        this.conversationHistory.push({
            role: 'assistant',
            content: response
        });

        return response;
    }

    async generateResponse(userMessage) {
        // Simulate thinking time
        await this.delay(800 + Math.random() * 1200);

        const lowerMessage = userMessage.toLowerCase();

        // Intelligent response generation based on context
        if (lowerMessage.includes('flower') || lowerMessage.includes('rose') || lowerMessage.includes('tulip') || 
            lowerMessage.includes('cherry') || lowerMessage.includes('lily') || lowerMessage.includes('peony') || 
            lowerMessage.includes('orchid')) {
            return this.getFlowerResponse(lowerMessage);
        } else if (lowerMessage.includes('website') || lowerMessage.includes('site') || lowerMessage.includes('page')) {
            return this.getWebsiteResponse(lowerMessage);
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return this.getGreetingResponse();
        } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
            return this.getHelpResponse();
        } else if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
            return this.getCodeResponse(lowerMessage);
        } else {
            return this.getGeneralResponse(userMessage);
        }
    }

    getFlowerResponse(message) {
        const responses = {
            rose: `## Roses - The Queen of Flowers 🌹

Roses are one of the most beloved flowers in the world, symbolizing **love, passion, and beauty**. Here are some fascinating facts:

### Characteristics:
- **Colors**: Red, pink, white, yellow, orange, and more
- **Symbolism**: Love, romance, admiration
- **Blooming Season**: Spring through fall

### Care Tips:
1. Plant in well-draining soil
2. Provide 6+ hours of sunlight
3. Water regularly but avoid overwatering
4. Prune in early spring

Roses have been cultivated for thousands of years and remain a timeless symbol of elegance and affection.`,

            tulip: `## Tulips - Spring's Elegant Herald 🌷

Tulips are graceful spring flowers that bring vibrant color and joy to gardens worldwide.

### Quick Facts:
- **Origin**: Central Asia and Turkey
- **Colors**: Nearly every color imaginable
- **Symbolism**: Perfect love, rebirth
- **Blooming**: Early to mid-spring

### Interesting History:
During the 17th century **Dutch Golden Age**, tulips were so valuable that single bulbs sold for the price of a house in what became known as "Tulip Mania"!

These elegant flowers continue to captivate with their simple yet stunning beauty.`,

            cherry: `## Cherry Blossoms - Nature's Fleeting Beauty 🌸

Cherry blossoms represent the ephemeral nature of life with their brief but spectacular blooming period.

### Cultural Significance:
- **Japanese**: *Sakura* - symbolizes renewal and the fleeting nature of life
- **Hanami**: Traditional cherry blossom viewing festivals

### Characteristics:
- **Color**: Delicate pink to white
- **Bloom Duration**: 1-2 weeks
- **Peak Season**: March-April (Northern Hemisphere)

The beauty of cherry blossoms reminds us to appreciate every moment and find joy in life's transient experiences.`
        };

        if (message.includes('rose')) return responses.rose;
        if (message.includes('tulip')) return responses.tulip;
        if (message.includes('cherry')) return responses.cherry;

        return `## The Beauty of Flowers 🌺

Flowers are nature's masterpieces, each one unique and beautiful in its own way. Our website showcases:

- **Roses**: Timeless symbols of love
- **Tulips**: Elegant spring heralds  
- **Cherry Blossoms**: Delicate and fleeting beauty
- **Lilies**: Grace and purity
- **Peonies**: Lush romantic blooms
- **Orchids**: Exotic sophistication

Each flower has its own story, symbolism, and special charm. What would you like to know more about?`;
    }

    getWebsiteResponse(message) {
        return `## About the Flower Website 🌸

Welcome to **Flower** - a beautiful showcase of nature's most elegant creations!

### Design Philosophy:
- **Color Scheme**: Clean white backgrounds with soft, light pink accents
- **Theme**: Minimalist elegance celebrating natural beauty
- **Typography**: Playfair Display for headings, Poppins for body text

### Features:
1. **Gallery**: Stunning collection of flower imagery
2. **AI Chat**: That's me! Here to help and inform
3. **Responsive Design**: Beautiful on all devices
4. **Educational Content**: Learn about different flowers

### Creator:
- **Name**: Aetherion
- **Discord**: 4etherion_
- **Instagram**: karabukdengeldik

The site is designed to inspire appreciation for the delicate artistry found in every petal! 🌺`;
    }

    getGreetingResponse() {
        const greetings = [
            `## Hello! 👋

I'm **Flower-1 Max**, your AI companion for all things flowers and more! I'm here to help you explore the beauty of nature, learn about different flowers, or discuss any topic you're interested in.

### I can help you with:
- Information about flowers and plants
- Details about this website
- General knowledge and conversations
- Code examples and technical topics

What would you like to talk about today?`,

            `## Hi there! 🌸

Welcome! I'm excited to chat with you. Whether you want to learn about the gorgeous flowers featured on this site, discuss gardening tips, or explore any other topic, I'm here to help.

**Feel free to ask me anything!**`,

            `## Hey! 🌺

Great to see you! I'm Flower-1 Max, and I'm here to make your experience wonderful. Ask me about flowers, nature, this website, or anything else on your mind.

**Let's have a great conversation!**`
        ];

        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    getHelpResponse() {
        return `## How I Can Help You 🤖

I'm **Flower-1 Max**, an advanced AI assistant with knowledge across many domains!

### My Capabilities:
1. **Flower & Nature Information**
   - Detailed facts about various flowers
   - Growing and care tips
   - Symbolism and cultural significance

2. **Website Information**
   - Details about this Flower website
   - Design philosophy and features
   - Creator information

3. **General Knowledge**
   - Answer questions on various topics
   - Provide explanations and insights
   - Educational content

4. **Technical Help**
   - Code examples
   - Programming concepts
   - Technical explanations

### Markdown Support:
I can format responses with:
- **Bold** and *italic* text
- \`code snippets\`
- Lists and headings
- Code blocks with syntax

**Just ask me anything, and I'll do my best to help!** 💬`;
    }

    getCodeResponse(message) {
        return `## Code Example 💻

Here's a simple example of how to create a beautiful flower animation with CSS:

\`\`\`css
.flower {
    width: 100px;
    height: 100px;
    background: linear-gradient(
        135deg,
        #ff69b4,
        #ffb6c1
    );
    border-radius: 50%;
    animation: bloom 2s ease-in-out infinite;
}

@keyframes bloom {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
}
\`\`\`

### JavaScript Example:

\`\`\`javascript
function createFlower(type, color) {
    return {
        type: type,
        color: color,
        bloom: function() {
            console.log(\`\${this.color} \${this.type} is blooming!\`);
        }
    };
}

const rose = createFlower('rose', 'pink');
rose.bloom(); // Output: pink rose is blooming!
\`\`\`

You can **copy the code** using the copy button above each code block! Would you like more examples?`;
    }

    getGeneralResponse(userMessage) {
        const responses = [
            `That's an interesting question! ${userMessage}

Based on what you're asking, I'd be happy to help. While I specialize in flowers and nature, I can discuss a wide range of topics.

### Here's what I think:
- Every question deserves a thoughtful answer
- Learning is a beautiful journey, much like watching a flower grow
- **I'm here to help you discover and understand**

Could you tell me more about what specifically interests you? I'd love to provide a more detailed response! 🌸`,

            `Thank you for your question about "${userMessage}"

I'm designed to be helpful across many topics! Whether you're curious about:
- **Nature and flowers** 🌺
- **This website** 💻
- **General knowledge** 📚
- **Or anything else** ✨

I'm here to assist. Could you provide a bit more context so I can give you the best possible answer?`,

            `## Great Question! 💭

You asked: "${userMessage}"

I appreciate your curiosity! While I may not have specific data on every topic, I'm here to:

1. **Share knowledge** about flowers and nature
2. **Provide information** about this website
3. **Discuss** various subjects thoughtfully
4. **Help** in any way I can

What aspect would you like me to focus on? I'm ready to provide more detailed information! 🌸`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.flowerAI = new FlowerAI();

    // Smooth scrolling for navigation
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

    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.flower-card, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // CTA button scroll to gallery
    document.querySelector('.cta-button')?.addEventListener('click', () => {
        document.querySelector('#gallery')?.scrollIntoView({
            behavior: 'smooth'
        });
    });
});
