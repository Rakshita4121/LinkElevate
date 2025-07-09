// routes/notifications.js
import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  const { subscription, token } = req.body;

  if (!token || !subscription) {
    return res.status(400).json({ message: 'Token and subscription are required' });
  }

  try {
    const user = await User.findOne({ token });

    if (!user) {
      console.log("❌ No user found for token:", token);
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.subscription || user.subscription.endpoint !== subscription.endpoint) {
      user.subscription = subscription;
      await user.save();
      console.log("✅ Subscription saved for user:", user.username);
    } else {
      console.log("ℹ️ Subscription already up-to-date for:", user.username);
    }

    return res.status(201).json({ message: '📬 Subscription saved successfully' });
  } catch (error) {
    console.error('❌ Error saving subscription:', error);
    return res.status(500).json({ message: 'Failed to save subscription' });
  }
});

export default router;
