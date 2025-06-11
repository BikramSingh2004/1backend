import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Faq', faqSchema);
