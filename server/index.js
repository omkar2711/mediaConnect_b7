
import express from 'express';
import authRouter from './routes/auth.js';
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from mediaConnect server!');
});

// Auth routes
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
