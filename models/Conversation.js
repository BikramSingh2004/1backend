import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: String,
  content: String,
});

const conversationSchema = new mongoose.Schema({
  userId: String,
  messages: [messageSchema],
  timestamp: { type: Date, default: Date.now },
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
