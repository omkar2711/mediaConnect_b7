import User from '../model/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register user
export const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const existingUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existingUser) return res.status(400).json({ message: 'User already exists' });
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, email, password: hashedPassword });
		await user.save();
		res.status(201).json({ message: 'User registered successfully' });
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};

// Login user
export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }
		const user = await User.findOne({ username });
		if (!user) return res.status(400).json({ message: 'Invalid credentials' });
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
		const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
		res.json({ token });
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
};
