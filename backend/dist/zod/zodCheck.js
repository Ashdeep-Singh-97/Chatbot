"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const zod_1 = require("zod");
// Middleware function to validate request body using Zod schema
const validateSchema = (schema) => {
    return (req, res, next) => {
        try {
            // Validate request body against schema
            schema.parse(req.body);
            console.log("validation ok !");
            next(); // If validation passes, proceed to the next middleware or route handler
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Respond with validation errors
                res.status(400).json({
                    message: 'Validation failed',
                    errors: error.errors,
                });
            }
            else {
                // Handle unexpected errors
                res.status(500).json({ message: 'Internal Server Error' });
            }
        }
    };
};
exports.validateSchema = validateSchema;
