const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // ✅ Reset all vendor/worker online status on startup
    // This fixes the "ghost online" bug: when the server restarts (e.g. nodemon),
    // all socket connections drop but isOnline stays true in DB. Users would then
    // see services from vendors who are not actually connected.
    try {
      const Vendor = require('../models/Vendor');
      const Worker = require('../models/Worker');

      const [vendorReset, workerReset] = await Promise.all([
        Vendor.updateMany(
          { isOnline: true },
          { isOnline: false, availability: 'OFFLINE', currentSocketId: null }
        ),
        Worker.updateMany(
          { status: 'ONLINE' },
          { status: 'OFFLINE' }
        )
      ]);

      if (vendorReset.modifiedCount > 0 || workerReset.modifiedCount > 0) {
        console.log(`[Startup] Reset ${vendorReset.modifiedCount} vendor(s) and ${workerReset.modifiedCount} worker(s) to OFFLINE`);
      }
    } catch (resetError) {
      // Non-fatal: log but don't crash server
      console.warn('[Startup] Could not reset online status:', resetError.message);
    }

  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;


