import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get conversations (latest message per user)
router.get('/conversations', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // In a real production app with massive scale, this query should be optimized.
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, username: true, isVIP: true } },
                receiver: { select: { id: true, username: true, isVIP: true } }
            }
        });

        // Group by user
        const conversationsMap = new Map();
        for (const msg of messages) {
            const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
            if (!conversationsMap.has(otherUser.id)) {
                conversationsMap.set(otherUser.id, {
                    user: otherUser,
                    lastMessage: msg.content,
                    timestamp: msg.createdAt,
                    unread: msg.receiverId === userId && !msg.isRead ? 1 : 0
                });
            } else if (msg.receiverId === userId && !msg.isRead) {
                const conv = conversationsMap.get(otherUser.id);
                conv.unread += 1;
            }
        }

        res.json(Array.from(conversationsMap.values()));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

export default router;
