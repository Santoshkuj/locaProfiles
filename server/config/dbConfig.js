import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const {connection} = await mongoose.connect(process.env.MONGO_URI);
    if (connection.readyState === 1) {
        console.log('MongoDB connected');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); 
  }
};
