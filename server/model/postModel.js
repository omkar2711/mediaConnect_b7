import mongoose from 'mongoose';
import { commentSchema } from './commentModel.js';

const postSchema = new mongoose.Schema({
  media: [{ type: String, required: true }], // Array of URLs or paths to media files
  caption: { type: String },
  likeCount: { type: Number, default: 0 },
  createdBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);
export default Post;
