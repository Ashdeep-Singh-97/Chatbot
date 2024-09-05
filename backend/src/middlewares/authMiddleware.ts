import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../db/db';

// Define your JWT secret or public key here (ideally store in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware function to check if user is authenticated
export function checkAuth(req: Request, res: Response, next: NextFunction): any {
  const email = req.body.email;
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    try {
      const user = await User.findOne({ email });

      const tokenUserId = (decoded as { id: string }).id;
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user._id.toString() !== tokenUserId) {
        return res.status(403).json({ error: 'User ID does not match' });
      }
    }
    catch (dbError) {
      console.error("Database error:", dbError); // Log the complete error
      return res.status(500).json({ error: 'Internal server error' });
    }
    next();
  });
}
