import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import roomRoutes from './routes/rooms.js';
import userRoutes from './routes/users.js';
import walletRoutes from './routes/wallet.js';
import messageRoutes from './routes/messages.js';
import adminRoutes from './routes/admin.js';
import gameRoutes from './routes/games.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/games', gameRoutes);

app.get('/', (req, res) => {
  res.send('Zakhmi Mahi API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
