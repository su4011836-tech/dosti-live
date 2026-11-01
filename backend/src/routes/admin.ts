import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to check if user is admin
const requireAdmin = async (req: AuthRequest, res: Response, next: express.NextFunction) => {
    if (req.user?.role !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden: Admins only' });
        return;
    }
    next();
};

router.get('/stats', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const totalUsers = await prisma.user.count();
        const activeRooms = await prisma.room.count();

        // Sum total revenue from gift transactions
        const revenueResult = await prisma.giftTransaction.aggregate({
            _sum: { amount: true }
        });

        // Count unread reports (simulated since we don't have a report table yet)
        const reportsCount = 0;

        res.json({
            totalUsers,
            activeRooms,
            totalRevenue: revenueResult._sum.amount || 0,
            reportsCount
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
});

export default router;
