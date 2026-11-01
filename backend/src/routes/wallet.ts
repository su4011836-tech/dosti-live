import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get Wallet Balance
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
         res.status(401).json({ error: 'Unauthorized' });
         return;
      }

      const wallet = await prisma.wallet.findUnique({
          where: { userId }
      });

      if (!wallet) {
          res.status(404).json({ error: 'Wallet not found' });
          return;
      }

      res.json(wallet);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch wallet' });
    }
});

// Demo feature: Send Gift (Atomic Transaction)
router.post('/gift', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const senderId = req.user?.id;
        const { receiverId, amount, giftName } = req.body;

        if (!senderId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!receiverId || !amount || !giftName || amount <= 0) {
            res.status(400).json({ error: 'Invalid gift parameters' });
            return;
        }

        // Use Prisma Transaction to ensure atomicity
        const transaction = await prisma.$transaction(async (tx) => {
            const senderWallet = await tx.wallet.findUnique({ where: { userId: senderId } });

            if (!senderWallet || senderWallet.balance < amount) {
                throw new Error("Insufficient balance");
            }

            // Deduct from sender
            await tx.wallet.update({
                where: { userId: senderId },
                data: { balance: { decrement: amount } }
            });

            // Add to receiver
            await tx.wallet.update({
                where: { userId: receiverId },
                data: { balance: { increment: amount } }
            });

            // Record transaction
            return await tx.giftTransaction.create({
                data: {
                    senderId,
                    receiverId,
                    amount,
                    giftName
                }
            });
        });

        res.json({ message: 'Gift sent successfully', transaction });

    } catch (error: any) {
        if (error.message === "Insufficient balance") {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Failed to process gift' });
    }
});

export default router;
