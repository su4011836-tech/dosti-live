import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            email: true,
            level: true,
            isVIP: true,
            coins: true,
            createdAt: true,
            wallet: {
                select: {
                    balance: true
                }
            },
            _count: {
                select: {
                    rooms: true,
                    giftsSent: true,
                    giftsRecv: true
                }
            }
        }
    });

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

export default router;
