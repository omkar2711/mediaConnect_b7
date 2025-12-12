import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getUserPosts
} from '../controller/userController.js';

const router = express.Router();


router.get('/', getUserProfile);
router.put('/', updateUserProfile);
router.post('/follow', followUser);
router.post('/unfollow', unfollowUser);
router.get('/posts' , getUserPosts);

export default router;
