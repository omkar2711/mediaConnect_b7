import express from 'express';
import User from '../model/userModel.js';

const router = express.Router();

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update/Edit user profile
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow user
router.post('/:id/follow', async (req, res) => {
  try {
    const userId = req.params.id;
    const followerId = req.body.followerId;
    if (userId === followerId) return res.status(400).json({ message: 'Cannot follow yourself' });
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);
    if (!user || !follower) return res.status(404).json({ message: 'User not found' });
    if (user.followers.includes(followerId)) return res.status(400).json({ message: 'Already following' });
    user.followers.push(followerId);
    user.followerCount = user.followers.length;
    follower.followings.push(userId);
    follower.followingCount = follower.followings.length;
    await user.save();
    await follower.save();
    res.json({ message: 'Followed user' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow user
router.post('/:id/unfollow', async (req, res) => {
  try {
    const userId = req.params.id;
    const followerId = req.body.followerId;
    if (userId === followerId) return res.status(400).json({ message: 'Cannot unfollow yourself' });
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);
    if (!user || !follower) return res.status(404).json({ message: 'User not found' });
    user.followers = user.followers.filter(id => id.toString() !== followerId);
    user.followerCount = user.followers.length;
    follower.followings = follower.followings.filter(id => id.toString() !== userId);
    follower.followingCount = follower.followings.length;
    await user.save();
    await follower.save();
    res.json({ message: 'Unfollowed user' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
