import express from 'express';
import {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  getAllPosts
} from '../controller/postController.js';

const router = express.Router();

router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);

export default router;
