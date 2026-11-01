import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Ensure uploads dir exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// GET /api/payments/settings - Retrieve JazzCash/Easypaisa details
router.get('/settings', authenticateToken, async (req: Request, res: Response) => {
    try {
        const settings = await prisma.appSetting.findMany({
            where: {
                key: { in: ['jazzcash_name', 'jazzcash_number', 'jazzcash_enabled', 'easypaisa_name', 'easypaisa_number', 'easypaisa_enabled'] }
            }
        });
        const formatted = settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payment settings' });
    }
});

// GET /api/payments/packages - Retrieve coin packages
router.get('/packages', authenticateToken, async (req: Request, res: Response) => {
    try {
        const packages = await prisma.coinPackage.findMany({
            where: { isActive: true },
            orderBy: { coins: 'asc' }
        });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch coin packages' });
    }
});

// POST /api/payments/manual - Submit manual payment request
router.post('/manual', authenticateToken, upload.single('screenshot'), async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { method, amountPaid, coinsRequested, transactionId } = req.body;
        const file = req.file;

        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        if (!file) {
            res.status(400).json({ error: 'Payment screenshot is required' });
            return;
        }

        if (!method || !amountPaid || !coinsRequested || !transactionId) {
            fs.unlinkSync(file.path); // Clean up file
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        // Check if transaction ID already exists to prevent duplicate submissions
        const existing = await prisma.paymentRequest.findUnique({ where: { transactionId } });
        if (existing) {
            fs.unlinkSync(file.path);
            res.status(400).json({ error: 'This transaction ID has already been submitted.' });
            return;
        }

        const request = await prisma.paymentRequest.create({
            data: {
                userId,
                method,
                amountPaid: parseFloat(amountPaid),
                coinsRequested: parseInt(coinsRequested, 10),
                transactionId,
                screenshotUrl: file.filename,
                status: 'PENDING'
            }
        });

        res.status(201).json({ message: 'Payment request submitted successfully', request });
    } catch (error: any) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Failed to submit payment request' });
    }
});

export default router;
