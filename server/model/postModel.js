import mongoose from 'mongoose';
import { commentSchema } from './commentModel.js';

const postSchema = new mongoose.Schema({
  media: { type: String, required: true }, // URL or path to media file
  caption: { type: String },
  likeCount: { type: Number, default: 0 },
  comments: [commentSchema],
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);
export default Post;
