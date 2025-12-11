import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser
} from '../controller/userController.js';

const router = express.Router();


router.get('/', getUserProfile);
router.put('/', updateUserProfile);
router.post('/:id/follow', followUser);
router.post('/:id/unfollow', unfollowUser);

export default router;
