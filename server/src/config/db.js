const mongoose = require('mongoose');

async function connectDB(uri) {
  // Retry so the API survives starting before MongoDB is ready
  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      await mongoose.connect(uri);
      console.log('MongoDB connected');
      return;
    } catch (err) {
      console.error(`MongoDB connection failed (attempt ${attempt}/10): ${err.message}`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  throw new Error('Could not connect to MongoDB');
}

module.exports = connectDB;
