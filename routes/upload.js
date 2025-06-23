import express from 'express';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const multer = require('multer');

import Document from '../models/Document.js';

const router = express.Router();

// Storage config
const upload = multer({ dest: 'uploads/' });

// Accept text, images, documents, and PDFs
const allowedTypes = ['.txt', '.doc', '.docx', '.pdf', '.jpg', '.jpeg', '.png'];

router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(ext)) {
    fs.unlinkSync(file.path); // cleanup
    return res.status(400).json({ error: 'Unsupported file type' });
  }

  try {
    let content = '';
    if (ext === '.txt') {
      content = fs.readFileSync(file.path, 'utf-8');
    } else {
      content = `[Binary file uploaded: ${file.originalname}]`;
    }

    await Document.create({
      filename: file.originalname,
      content,
    });

    fs.unlinkSync(file.path);

    res.json({ message: 'File uploaded and metadata saved', filename: file.originalname });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Failed to upload' });
  }
});

export default router;
