import express from 'express';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const multer = require('multer');

import Document from '../models/Document.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload-faq', upload.single('faq'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filePath = path.join('uploads', file.filename);
    const text = fs.readFileSync(filePath, 'utf-8');

    await Document.create({
      filename: file.originalname,
      content: text,
    });

    fs.unlinkSync(filePath); // Clean up after storing

    console.log('📄 Uploaded FAQ Saved:', file.originalname);
    res.json({ message: 'FAQ document uploaded and stored' });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
