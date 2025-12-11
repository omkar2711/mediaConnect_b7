import express from 'express';
import {
  addComment,
  getCommentsByPost,
  deleteComment,
  updateComment
} from '../controller/commentController.js';

const router = express.Router();

// Add a comment to a post
router.post('/:postId', addComment);
// Get all comments for a post
router.get('/:postId', getCommentsByPost);
// Update a comment
router.put('/:commentId', updateComment);
// Delete a comment
router.delete('/:commentId', deleteComment);

export default router;
