const mongoose = require('mongoose');

/**
 * WorkerHandover Model
 * Tracks cash handover from worker to vendor
 */
const workerHandoverSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true,
    index: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  bookingIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  transactionIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  handoverMethod: {
    type: String,
    enum: ['cash', 'upi', 'other'],
    default: 'cash'
  },
  workerNotes: {
    type: String,
    default: null
  },
  vendorNotes: {
    type: String,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WorkerHandover', workerHandoverSchema);
