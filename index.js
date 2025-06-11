import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import chatRoutes from './routes/chat.js';
import uploadRoutes from './routes/upload.js';
import faqRoutes from './routes/faq.js';
import authRoutes from './routes/auth.js'; // 👈 import this at the top
import setupAdminRoute from './routes/setupAdmin.js';


const app = express();

// ✅ Set up middleware first
app.use(cors());
app.use(express.json());

// ✅ Then register all API routes
app.use('/api/auth', authRoutes); //  mount under /api/auth
app.use('/api', chatRoutes);
app.use('/api', uploadRoutes);
app.use('/api', faqRoutes);
app.use('/api', setupAdminRoute);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB Error:', err));
