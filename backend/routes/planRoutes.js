// routes/planRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTodayPlan,
  getPlanByDate,
  addTopic,
  updateTopic,
  deleteTopic,
  getPlansRange
} = require('../controllers/planController');

router.use(protect); // All routes require authentication

router.get('/today', getTodayPlan);
router.get('/date/:date', getPlanByDate);
router.get('/range/:startDate/:endDate', getPlansRange);
router.post('/topic', addTopic);
router.put('/topic/:topicId', updateTopic);
router.delete('/topic/:topicId', deleteTopic);

module.exports = router;