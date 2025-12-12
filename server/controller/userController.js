
import User from '../model/userModel.js';
import jwt from 'jsonwebtoken';
import { getUserIdFromHeader } from '../helper/getUserId.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Get user profile by ID or from JWT token
export const getUserProfile = async (req, res) => {
	try {
		let userId = req.params.id;
		if (!userId) {
			const authHeader = req.headers.authorization;
			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				return res.status(401).json({ message: 'No token, authorization denied' });
			}
			const token = authHeader.split(' ')[1];
			try {
				const decoded = jwt.verify(token, JWT_SECRET);
				userId = decoded.userId;
			} catch (err) {
				return res.status(401).json({ message: 'Token is not valid' });
			}
		}
		const user = await User.findById(userId).select('-password');
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: 'Server error', error : err });
	}
};

// Update/Edit user profile
export const updateUserProfile = async (req, res) => {
	try {
		let userId = req.params.id;
		if (!userId) {
			const authHeader = req.headers.authorization;
			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				return res.status(401).json({ message: 'No token, authorization denied' });
			}
			const token = authHeader.split(' ')[1];
			try {
				const decoded = jwt.verify(token, JWT_SECRET);
				userId = decoded.userId;
			} catch (err) {
				return res.status(401).json({ message: 'Token is not valid' });
			}
		}
		const updates = req.body;
		const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: 'Server error', error : err });
	}
};

// Follow user
export const followUser = async (req, res) => {
	try {
		const userId = getUserIdFromHeader(req);
		const followerId = req.body.followerId;
		if (userId === followerId) return res.status(400).json({ message: 'Cannot follow yourself' });
		const user = await User.findById(userId);
		const follower = await User.findById(followerId);
		if (!user || !follower) return res.status(404).json({ message: 'User not found' });
		if (user.followings.includes(followerId)) return res.status(400).json({ message: 'Already following' });
		user.followings.push(followerId);
		user.followingCount = user.followings.length;
		follower.followers.push(userId);
		follower.followerCount = follower.followers.length;
		await user.save();
		await follower.save();
		res.json({ message: 'Followed user' });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error : err.message });
	}
};

// Unfollow user
export const unfollowUser = async (req, res) => {
	try {
		const userId = getUserIdFromHeader(req);
		const followerId = req.body.followerId;
		if (userId === followerId) return res.status(400).json({ message: 'Cannot unfollow yourself' });
		const user = await User.findById(userId);
		const follower = await User.findById(followerId);
		if (!user || !follower) return res.status(404).json({ message: 'User not found' });
		user.followings = user.followings.filter(id => id.toString() !== followerId);
		user.followingCount = user.followings.length;
		follower.followers = follower.followers.filter(id => id.toString() !== userId);
		follower.followerCount = follower.followers.length;
		await user.save();
		await follower.save();
		res.json({ message: 'Unfollowed user' });
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};



// Get all posts of the authenticated user
export const getUserPosts = async (req, res) => {
  try {
    let userId = req.params.userId;
    if (!userId) {
      userId = getUserIdFromHeader(req);
    }
    if (!userId) {
      return res.status(401).json({ message: 'No token or user ID provided' });
    }
    const user = await User.findById(userId).populate('posts');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
