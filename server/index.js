import express from 'express';
import authRouter from './routes/auth.js';
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from mediaConnect server!');
});

// Auth routes
app.use('/api/auth', authRouter);
// User routes
app.use('/api/users', userRouter);
// Post routes
app.use('/api/posts', postRouter);
// Comment routes
app.use('/api/comments', commentRouter);

//route not found middleware
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
