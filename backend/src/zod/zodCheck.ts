import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Middleware function to validate request body using Zod schema
const validateSchema = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body against schema
      schema.parse(req.body);
      console.log("validation ok !");
      next(); // If validation passes, proceed to the next middleware or route handler
    } catch (error) {
      if (error instanceof ZodError) {
        // Respond with validation errors
        res.status(400).json({
          message: 'Validation failed',
          errors: error.errors,
        });
      } else {
        // Handle unexpected errors
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  };
};

export { validateSchema };
