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

// Admin: Get all payment requests
router.get('/payments', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        const requests = await prisma.paymentRequest.findMany({
            include: { user: { select: { username: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment requests' });
    }
});

// Admin: Process payment request (Approve/Reject)
router.post('/payments/:id/process', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { status, adminNote } = req.body;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            res.status(400).json({ error: 'Invalid status' });
            return;
        }

        // Use a transaction to ensure no double-credits
        const result = await prisma.$transaction(async (tx) => {
            const request = await tx.paymentRequest.findUnique({ where: { id } });

            if (!request) throw new Error('Request not found');
            if (request.status !== 'PENDING') throw new Error(`Request is already ${request.status}`);

            // Update status
            const updated = await tx.paymentRequest.update({
                where: { id },
                data: { status, adminNote }
            });

            // If approved, atomic increment user wallet
            if (status === 'APPROVED') {
                await tx.wallet.update({
                    where: { userId: request.userId },
                    data: { balance: { increment: request.coinsRequested } }
                });
            }

            return updated;
        });

        res.json({ message: `Payment ${status.toLowerCase()}`, result });
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Failed to process payment' });
    }
});

// Admin: Get Settings
router.get('/settings', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
    try {
        const settings = await prisma.appSetting.findMany();
        const formatted = settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Admin: Update Settings
router.post('/settings', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const updates = req.body; // e.g. { jazzcash_enabled: "true", jazzcash_number: "123" }

        for (const [key, value] of Object.entries(updates)) {
            await prisma.appSetting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            });
        }
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

export default router;
