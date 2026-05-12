const Worker = require('../../models/Worker');
const Transaction = require('../../models/Transaction');
const Booking = require('../../models/Booking');

/**
 * Get worker wallet with ledger balance
 */
const getWallet = async (req, res) => {
  try {
    const workerId = req.user.id;
    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // List of bookings pending payment
    const pendingBookings = await Booking.find({
      workerId: workerId,
      status: 'completed', // Only completed jobs
      workerPaymentStatus: 'PENDING'
    })
      .select('bookingNumber serviceName completedAt vendorId finalAmount vendorBillId')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        balance: worker.wallet?.balance || 0,
        pendingBookings: pendingBookings
      }
    });

  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch wallet info' });
  }
};

/**
 * Get worker transactions
 */
const getTransactions = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { page = 1, limit = 20, type } = req.query;

    const query = { workerId };

    // Filter by type if provided
    if (type && type !== 'all') {
      query.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
};

const { sendPushNotification } = require('../../services/firebaseAdmin');

/**
 * Request payout from vendor for a specific booking
 */
const requestPayout = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { bookingId } = req.body;
    const worker = await Worker.findById(workerId);

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      workerId: workerId,
      status: 'completed',
      workerPaymentStatus: 'PENDING'
    }).populate('vendorId'); // Ensure vendor is populated to access tokens

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found or already paid' });
    }

    if (!booking.vendorId) {
      return res.status(400).json({ success: false, message: 'No vendor associated with this booking' });
    }

    const vendor = booking.vendorId;
    const message = `Worker ${worker.name} has requested payment for Booking #${booking.bookingNumber}.`;
    const title = '💸 Payout Request';

    // Use createNotification helper for proper notification delivery
    const { createNotification } = require('../notificationControllers/notificationController');
    await createNotification({
      vendorId: vendor._id,
      type: 'payout_requested',
      title: title,
      message: message,
      relatedId: booking._id,
      relatedType: 'booking',
      priority: 'high',
      pushData: {
        type: 'payout_requested',
        bookingId: booking._id.toString(),
        link: `/vendor/booking/${booking._id}`
      }
    });

    res.status(200).json({ success: true, message: 'Payment request sent to vendor' });

  } catch (error) {
    console.error('Request payout error:', error);
    res.status(500).json({ success: false, message: 'Failed to send payout request' });
  }
};

const WorkerHandover = require('../../models/WorkerHandover');

/**
 * Handover collected cash to vendor
 */
const handoverCash = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { amount, bookingIds, transactionIds, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const worker = await Worker.findById(workerId);
    if (!worker || !worker.vendorId) {
      return res.status(400).json({ success: false, message: 'Worker or vendor not found' });
    }

    const handover = await WorkerHandover.create({
      workerId,
      vendorId: worker.vendorId,
      amount,
      bookingIds: bookingIds || [],
      transactionIds: transactionIds || [],
      workerNotes: notes,
      status: 'pending'
    });

    // Notify vendor
    const { createNotification } = require('../notificationControllers/notificationController');
    await createNotification({
      vendorId: worker.vendorId,
      type: 'cash_handover_requested',
      title: '🤝 Cash Handover Request',
      message: `Worker ${worker.name} has requested handover of ₹${amount} cash.`,
      relatedId: handover._id,
      relatedType: 'worker_handover',
      priority: 'high',
      pushData: {
        type: 'cash_handover_requested',
        handoverId: handover._id.toString(),
        link: `/vendor/wallet/handovers`
      }
    });

    res.status(201).json({
      success: true,
      message: 'Handover request sent to vendor',
      data: handover
    });

  } catch (error) {
    console.error('Handover cash error:', error);
    res.status(500).json({ success: false, message: 'Failed to request handover' });
  }
};

module.exports = {
  getWallet,
  getTransactions,
  requestPayout,
  handoverCash
};

