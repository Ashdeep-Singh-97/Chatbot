import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define your JWT secret or public key here (ideally store in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware function to check if user is authenticated
export function checkAuth(req: Request, res: Response, next: NextFunction): any {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Attach user information to the request object
    // req.user = decoded; // Assuming the decoded token includes user information
    next();
  });
}
