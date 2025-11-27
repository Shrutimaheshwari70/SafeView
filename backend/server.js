

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import kidRoutes from './routes/kidRoutes.js';
import playlistRoutes from './routes/playlistRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parent', parentRoutes);      // Parent routes
app.use('/api/parent', playlistRoutes);    // Playlist routes under parent
app.use('/api/kid', kidRoutes);
app.use("/playlist", playlistRoutes); // separate prefix to avoid conflicts

app.get('/', (req, res) => res.send('SafeView backend running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
