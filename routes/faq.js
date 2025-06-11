import express from 'express';
import Faq from '../models/Faq.js';

const router = express.Router();

// GET all FAQs
router.get('/faq', async (req, res) => {
  const faqs = await Faq.find().sort({ createdAt: -1 });
  res.json(faqs);
});

// POST new FAQ
router.post('/faq', async (req, res) => {
  const { question, answer } = req.body;
  const newFaq = await Faq.create({ question, answer });
  res.json(newFaq);
});

// DELETE FAQ
router.delete('/faq/:id', async (req, res) => {
  await Faq.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
