import Comment from '../model/commentModel.js';
import Post from '../model/PostModel.js';

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { user, text } = req.body;
    const postId = req.params.postId;
    const comment = new Comment({ user, text });
    await comment.save();
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment } });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, { new: true });
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    // Optionally remove from post.comments array
    await Post.updateMany({}, { $pull: { comments: { _id: req.params.commentId } } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
