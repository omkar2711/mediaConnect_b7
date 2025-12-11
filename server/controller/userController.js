
import User from '../model/userModel.js';
import jwt from 'jsonwebtoken';

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
		res.status(500).json({ message: 'Server error' });
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
		res.status(500).json({ message: 'Server error' });
	}
};

// Follow user
export const followUser = async (req, res) => {
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
};

// Unfollow user
export const unfollowUser = async (req, res) => {
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
};
