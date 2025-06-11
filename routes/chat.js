import dotenv from 'dotenv';
dotenv.config();

import Faq from '../models/Faq.js';
import Document from '../models/Document.js';
import express from 'express';
import axios from 'axios';
import Conversation from '../models/Conversation.js';

const router = express.Router();

const MODEL = process.env.OPENROUTER_MODEL;
const API_KEY = process.env.OPENROUTER_API_KEY;

router.post('/message', async (req, res) => {
  const { message, userId = 'default-user' } = req.body;

  try {
    // 1. Load FAQs from DB
    const faqs = await Faq.find();
    const faqContext = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');

    // 2. Load uploaded documents
    const docs = await Document.find();
    const docContext = docs.map(d => `📄 ${d.filename}\n${d.content}`).join('\n\n');

    // 3. Combine FAQ and Document context
    const messages = [
      {
        role: 'system',
        content: `You are a helpful support assistant. Use the following FAQs and documents if relevant to answer the user's question:\n\n${faqContext}\n\n${docContext}`,
      },
      {
        role: 'user',
        content: message,
      },
    ];

    // 4. Send to OpenRouter
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'AI Customer Support Chat',
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    await Conversation.create({
      userId,
      messages: [
        { role: 'user', content: message },
        { role: 'assistant', content: reply },
      ],
      timestamp: new Date(),
    });

    res.json({ reply });
  } catch (err) {
    console.error('❌ OpenRouter Error:', err.response?.data || err.message);
    res.status(500).json({ reply: 'Failed to get response from OpenRouter.' });
  }
});

export default router;
