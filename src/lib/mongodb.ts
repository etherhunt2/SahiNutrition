import mongoose from 'mongoose';

const MONGODB_URI = import.meta.env?.MONGODB_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sahi-nutrition';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
