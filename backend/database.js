const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI || 'mongodb+srv://root:root@cluster0.wlf1p1l.mongodb.net/ProyectoAPI?appName=Cluster0';

// Cache the connection across serverless invocations (avoids re-connecting on every request)
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 8000,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // allow retry on next request
    throw err;
  }

  return cached.conn;
}

module.exports = connectDB;
