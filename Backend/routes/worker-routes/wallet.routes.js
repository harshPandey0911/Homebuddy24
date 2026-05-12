const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/authMiddleware');
const { isWorker } = require('../../middleware/roleMiddleware');
const {
  getWallet,
  getTransactions,
  requestPayout,
  handoverCash
} = require('../../controllers/workerControllers/workerWalletController');

// Get wallet balance
router.get('/', authenticate, isWorker, getWallet);

// Get transaction history
router.get('/transactions', authenticate, isWorker, getTransactions);

// Request payout from vendor
router.post('/request-payout', authenticate, isWorker, requestPayout);

// Handover collected cash to vendor
router.post('/handover-cash', authenticate, isWorker, handoverCash);

module.exports = router;

