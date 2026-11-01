import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AccessToken } from 'livekit-server-sdk';
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
        },
        _count: {
          select: { participants: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    // Map _count.participants to viewers for backward compatibility with frontend
    const mappedRooms = rooms.map((r: any) => ({
      ...r,
      viewers: r._count.participants
    }));
    res.json(mappedRooms);
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
        },
        _count: {
          select: { participants: true }
        }
      }
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    res.json({
        ...room,
        viewers: (room as any)._count.participants
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// Join a room (Create RoomParticipant and Generate LiveKit Token)
router.post('/:id/join', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    if (!userId) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }

    const room = await prisma.room.findUnique({
      where: { id }
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    // Upsert participant to avoid unique constraint failures on rejoin
    await prisma.roomParticipant.upsert({
      where: {
        roomId_userId: {
            roomId: id,
            userId: userId
        }
      },
      update: { joinedAt: new Date() },
      create: {
        roomId: id,
        userId: userId,
        role: room.hostId === userId ? 'HOST' : 'LISTENER'
      }
    });

    // Generate LiveKit Token
    let liveKitToken = null;
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (apiKey && apiSecret) {
      const at = new AccessToken(apiKey, apiSecret, {
        identity: userId,
        name: user?.username || 'Unknown',
        ttl: '10m', // 10 minutes session for testing
      });
      at.addGrant({ roomJoin: true, room: id, canPublish: room.hostId === userId, canSubscribe: true });
      liveKitToken = await at.toJwt();
    }

    res.json({
      message: 'Joined room successfully',
      liveKitToken,
      liveKitUrl: process.env.LIVEKIT_URL || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to join room' });
  }
});

// Leave a room (Remove RoomParticipant)
router.post('/:id/leave', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
         res.status(401).json({ error: 'Unauthorized' });
         return;
      }

      await prisma.roomParticipant.deleteMany({
          where: {
              roomId: id,
              userId: userId
          }
      });

      res.json({ message: 'Left room successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to leave room' });
    }
  });


export default router;
