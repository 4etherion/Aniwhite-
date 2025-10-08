const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint for AI chat (using Claude API)
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // For production, you would use the actual Claude API here
        // This is a placeholder that returns contextual responses
        const response = generateContextualResponse(message);
        
        res.json({ response });
    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({ error: 'Failed to process chat request' });
    }
});

// Generate contextual responses (placeholder for actual Claude API)
function generateContextualResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Flower-specific responses
    if (lowerMessage.includes('flower') || lowerMessage.includes('bloom')) {
        return `Flowers are nature's way of showing us that beauty can emerge from the simplest beginnings. Each bloom tells a unique story of growth, resilience, and natural artistry. What specific aspect of flowers interests you most?`;
    }
    
    if (lowerMessage.includes('rose')) {
        return `Roses have captivated humanity for millennia. Their layered petals, enchanting fragrance, and symbolic significance make them one of the most cherished flowers worldwide. From the deep crimson of passion to the pure white of innocence, roses speak a universal language of emotion.`;
    }
    
    if (lowerMessage.includes('garden')) {
        return `Creating a flower garden is like painting with living colors. Start with understanding your climate zone, soil type, and sunlight availability. Mix perennials for lasting beauty with annuals for seasonal bursts of color. Remember, the best gardens reflect both nature's wisdom and the gardener's personality.`;
    }
    
    // Default response
    return `Thank you for your message. The Flower website celebrates the extraordinary beauty of nature's blooms. Whether you're interested in learning about specific flowers, gardening techniques, or the symbolic meanings of different blooms, I'm here to help explore the wonderful world of floriculture with you.`;
}

// Start server
app.listen(PORT, () => {
    console.log(`🌸 Flower website running on http://localhost:${PORT}`);
    console.log(`✨ Created with love by Aetherion`);
});