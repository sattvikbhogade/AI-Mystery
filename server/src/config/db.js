import mongoose from 'mongoose';

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required.');
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  } catch (error) {
    if (error.code === 'ECONNREFUSED' && String(error.message).includes('querySrv')) {
      throw new Error('MongoDB Atlas DNS lookup failed. Re-copy the SRV connection string from Atlas and check that your network or DNS provider allows SRV lookups. For local MongoDB, set MONGODB_URI=mongodb://127.0.0.1:27017/ai-mystery-room.');
    }
    if (error.name === 'MongoServerSelectionError' || error.name === 'MongooseServerSelectionError') {
      throw new Error('Could not connect to MongoDB. Check that the cluster is running, the URI is correct, and your client IP is allowed in Atlas Network Access.');
    }
    throw error;
  }
  console.info('MongoDB connected');
}
