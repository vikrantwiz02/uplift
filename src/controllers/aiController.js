import axios from 'axios';

export const aiChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      // Provide a helpful mock response when API key is not configured
      const mockResponses = [
        "I'm here to help with your wellness journey! While I'm in demo mode right now, I'd love to support you. Here are some quick tips: Take a few deep breaths, practice gratitude, and remember that it's okay to take things one step at a time. How are you feeling today?",
        "Thank you for reaching out! I'm currently in demo mode, but I want you to know that your mental health matters. Consider trying a 5-minute mindfulness exercise: focus on your breathing and let yourself be present in this moment. What's something positive you can focus on right now?",
        "I appreciate you connecting with me! Even though I'm in demo mode, I'm here in spirit. Remember that taking care of your mental health is a brave and important step. Try writing down three things you're grateful for today. Is there anything specific on your mind you'd like to talk about?",
        "Hello! I'm in demo mode currently, but I want to remind you that you're not alone in your wellness journey. A simple tip: try the 4-7-8 breathing technique (inhale for 4, hold for 7, exhale for 8). What brings you here today?"
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      return res.json({
        response: randomResponse,
        message: randomResponse, // Keep both for compatibility
        timestamp: new Date().toISOString(),
        isDemoMode: true
      });
    }

    // Enhanced system prompt for better mental health support
    const systemPrompt = `You are Uplift AI, a compassionate and knowledgeable mental health and wellness assistant. Your primary goal is to provide supportive, empathetic, and helpful responses to users on their mental health journey.

Core Guidelines:
- Be warm, understanding, and non-judgmental in all interactions
- Provide practical, evidence-based wellness tips and coping strategies
- Encourage professional help when appropriate, especially for serious concerns
- Never provide medical diagnoses or replace professional therapy
- Focus on mindfulness, self-care, positive mental health practices, and resilience building
- Keep responses helpful but concise (aim for 2-3 paragraphs maximum)
- Use encouraging and hopeful language while validating feelings
- Offer specific, actionable suggestions when possible

Safety Protocols:
- If someone expresses suicidal thoughts or self-harm, immediately encourage them to seek professional help
- Provide crisis resources: "Please reach out for immediate help: Call 988 (US), text HOME to 741741, or contact emergency services"
- For serious mental health concerns, always recommend professional support

Your role is to be a supportive companion, offering guidance, encouragement, and practical tools for mental wellness while maintaining appropriate boundaries.`;

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.role !== 'user') {
      return res.status(400).json({ error: 'Please provide a message to get started.' });
    }

    // Build conversation context (last 5 messages for context)
    const recentMessages = messages.slice(-5);
    const conversationContext = recentMessages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Prepare the prompt for Gemini
    const prompt = `${systemPrompt}\n\nConversation History:\n${conversationContext}\n\nPlease respond to the user's latest message with empathy and helpful guidance.`;

    // Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from AI service');
    }

    const aiResponse = response.data.candidates[0].content.parts[0].text;

    res.json({
      response: aiResponse,
<<<<<<< HEAD:src/controllers/aiController.js
      message: aiResponse, // Keep both for compatibility
=======
>>>>>>> eada28ca4e6fb2a278fce958938396610a60e6bf:server/src/controllers/aiController.js
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again in a moment.' 
      });
    }
    
    if (error.response?.status === 401) {
      return res.status(500).json({ 
        error: 'AI service authentication failed. Please try again later.' 
      });
    }

    res.status(500).json({ 
      error: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.' 
    });
  }
};

export const getWellnessTips = async (req, res) => {
  try {
    const { category = 'general' } = req.query;

    const tips = {
      general: [
        "Practice deep breathing exercises for 5 minutes daily",
        "Take regular breaks from screens to rest your eyes and mind",
        "Stay hydrated by drinking water throughout the day",
        "Get some fresh air and sunlight when possible"
      ],
      anxiety: [
        "Try the 5-4-3-2-1 grounding technique when feeling anxious",
        "Practice progressive muscle relaxation",
        "Keep a worry journal to track and address concerns",
        "Use positive self-talk and affirmations"
      ],
      sleep: [
        "Establish a consistent bedtime routine",
        "Avoid screens 1 hour before sleep",
        "Keep your bedroom cool and dark",
        "Try relaxation techniques before bed"
      ],
      stress: [
        "Practice mindfulness meditation for 10 minutes daily",
        "Break large tasks into smaller, manageable steps",
        "Connect with supportive friends or family",
        "Engage in physical activity to release tension"
      ]
    };

    const selectedTips = tips[category] || tips.general;
    const randomTip = selectedTips[Math.floor(Math.random() * selectedTips.length)];

    res.json({
      tip: randomTip,
      category,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
