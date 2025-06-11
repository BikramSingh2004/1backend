import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// One-time admin setup route
router.get('/setup-admin', async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ email: 'bikram.2201120cs@iiitbh.iiitbh.ac.in' });
    if (existingAdmin) {
      return res.status(200).json({ message: 'Admin already exists' });
    }

    const passwordHash = await bcrypt.hash('bikki12345', 10);
    await User.create({
      email: 'bikram.2201120cs@iiitbh.iiitbh.ac.in',
      passwordHash,
      role: 'admin',
    });

    res.status(201).json({ message: 'Default admin created successfully' });
  } catch (err) {
    console.error('Admin setup failed:', err);
    res.status(500).json({ error: 'Admin setup failed' });
  }
});

export default router;
