import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all rooms
router.get('/', async (req: Request, res: Response) => {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        host: {
          select: {
            username: true,
            level: true,
            isVIP: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Create a new room
router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, isVIP, tags } = req.body;
    const hostId = req.user?.id;

    if (!hostId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!name) {
      res.status(400).json({ error: 'Room name is required' });
      return;
    }

    const newRoom = await prisma.room.create({
      data: {
        name,
        description,
        isVIP: isVIP || false,
        tags: tags || [],
        hostId
      }
    });

    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Get a specific room
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        host: {
          select: {
            username: true,
            level: true,
            isVIP: true,
          }
        }
      }
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Join a room (increment viewers)
router.post('/:id/join', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    if (!userId) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }

    const room = await prisma.room.update({
      where: { id },
      data: {
        viewers: {
          increment: 1
        }
      }
    });

    res.json({ message: 'Joined room successfully', room });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Leave a room (decrement viewers)
router.post('/:id/leave', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
         res.status(401).json({ error: 'Unauthorized' });
         return;
      }

      // Atomic decrement, ensuring it doesn't drop below 0 if somehow out of sync
      const currentRoom = await prisma.room.findUnique({ where: { id }});
      if (!currentRoom) {
          res.status(404).json({ error: 'Room not found' });
          return;
      }

      const room = await prisma.room.update({
        where: { id },
        data: {
          viewers: currentRoom.viewers > 0 ? { decrement: 1 } : 0
        }
      });

      res.json({ message: 'Left room successfully', room });
    } catch (error) {
      res.status(500).json({ error: 'Failed to leave room' });
    }
  });


export default router;
