import Post from '../model/PostModel.js';
import User from '../model/userModel.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { media, caption, userId } = req.body;
    const post = new Post({ media, caption });
    await post.save();
    // Optionally add post to user's posts array
    if (userId) {
      await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });
    }
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Like post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.likeCount += 1;
    await post.save();
    res.json({ message: 'Post liked', likeCount: post.likeCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
