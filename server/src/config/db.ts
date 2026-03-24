import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/anonconfess';
  let retries = 5;

  while (retries > 0) {
    try {
      await mongoose.connect(uri);
      console.log('✅ MongoDB connected');
      return;
    } catch (err) {
      retries--;
      console.error(`MongoDB connection failed. Retries left: ${retries}`, err);
      if (retries === 0) throw err;
      await new Promise((res) => setTimeout(res, 3000));
    }
  }
};

export default connectDB;
