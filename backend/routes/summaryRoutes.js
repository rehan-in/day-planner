// routes/summaryRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createSummary,
  getTodaySummary,
  getSummaryByDate,
  getAllSummaries
} = require('../controllers/summaryController');

router.use(protect); // All routes require authentication

router.post('/', createSummary);
router.get('/today', getTodaySummary);
router.get('/all', getAllSummaries);
router.get('/:date', getSummaryByDate);

module.exports = router;