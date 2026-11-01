import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Play Lucky Spin
router.post('/spin', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { betAmount } = req.body;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        if (betAmount <= 0) {
             res.status(400).json({ error: 'Invalid bet amount' });
             return;
        }

        const transaction = await prisma.$transaction(async (tx) => {
            const wallet = await tx.wallet.findUnique({ where: { userId } });

            if (!wallet || wallet.balance < betAmount) {
                throw new Error("Insufficient balance");
            }

            // Game Logic:
            // 50% chance to lose bet
            // 30% chance to win 1.5x
            // 15% chance to win 2x
            // 5% chance to win 5x

            const roll = Math.random() * 100;
            let wonAmount = 0;
            let multiplier = 0;

            if (roll > 50 && roll <= 80) multiplier = 1.5;
            else if (roll > 80 && roll <= 95) multiplier = 2;
            else if (roll > 95) multiplier = 5;

            wonAmount = Math.floor(betAmount * multiplier);
            const netChange = wonAmount - betAmount;

            await tx.wallet.update({
                where: { userId },
                data: { balance: { increment: netChange } }
            });

            await tx.gameHistory.create({
                data: {
                    gameName: "Lucky Spin",
                    userId,
                    betAmount,
                    wonAmount
                }
            });

            return { wonAmount, netChange, multiplier };
        });

        res.json({ message: 'Spin complete', result: transaction });
    } catch (error: any) {
        if (error.message === "Insufficient balance") {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Failed to play game' });
    }
});

export default router;
