

import { get } from 'mongoose';
import Post from '../model/PostModel.js';
import User from '../model/userModel.js';
import { getUserIdFromHeader } from '../helper/getUserId.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const userId = getUserIdFromHeader(req);
    let { media, caption } = req.body;
    // Ensure media is an array and not empty
    if (!Array.isArray(media)) {
      media = media ? [media] : [];
    }
    if (!media.length) {
      return res.status(400).json({ message: 'At least one media item is required.' });
    }
    const post = new Post({ media, caption, createdBy: userId });
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
    const userId = getUserIdFromHeader(req);
    if (!userId) {
      return res.status(401).json({ message: 'No token or user ID provided' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.likedBy = post.likedBy || [];
    const alreadyLiked = post.likedBy.includes(userId);
    if (alreadyLiked) {
      // Unlike the post
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
      post.likeCount = Math.max(0, post.likeCount - 1);
      await post.save();
      return res.json({ message: 'Post unliked', likeCount: post.likeCount });
    } else {
      // Like the post
      post.likeCount += 1;
      post.likedBy.push(userId);
      await post.save();
      return res.json({ message: 'Post liked', likeCount: post.likeCount });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};



