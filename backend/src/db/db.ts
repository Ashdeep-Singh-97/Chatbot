import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const mongoURI = process.env.DB_URL || ""; // Replace with your MongoDB URI
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

// Define a schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true,
});

userSchema.methods.comparePassword = async function(candidatePassword: any) {
  return bcrypt.compare(candidatePassword, this.password);
};
// Create a model from the schema
const User = mongoose.model('User', userSchema);

// Export the model
export { User };
