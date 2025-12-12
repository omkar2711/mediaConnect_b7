import express from 'express';
import {
  createPost,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  getAllPosts
} from '../controller/postController.js';

const postRouter = express.Router();

postRouter.post('/', createPost);
postRouter.get('/', getAllPosts);
postRouter.get('/:id', getPostById);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id', deletePost);
postRouter.post('/like/:id', likePost);


export default postRouter;