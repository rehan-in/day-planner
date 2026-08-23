// controllers/planController.js
const Plan = require('../models/Plan');
const Summary = require('../models/Summary');

// Helper to normalize dates to midnight local time
const normalizeDate = (dateString) => {
  let date;
  if (!dateString) {
    date = new Date();
  } else if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(dateString);
  }
  date.setHours(0, 0, 0, 0);
  return date;
};

// @desc    Get today's plan
// @route   GET /api/plans/today
// @access  Private
exports.getTodayPlan = async (req, res) => {
  try {
    const today = normalizeDate();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    let plan = await Plan.findOne({
      user: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    }).populate('summary');

    if (!plan) {
      plan = await Plan.create({
        user: req.user.id,
        date: today,
        topics: []
      });
    }

    res.status(200).json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('❌ Error getting today plan:', error);
    res.status(500).json({
      success: false,
      message: 'Server error loading plan'
    });
  }
};

// @desc    Get plan by specific date (YYYY-MM-DD)
// @route   GET /api/plans/date/:date
// @access  Private
exports.getPlanByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = normalizeDate(date);
    const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    let plan = await Plan.findOne({
      user: req.user.id,
      date: { $gte: targetDate, $lt: nextDate }
    }).populate('summary');

    if (!plan) {
      // Auto create empty plan container for target date
      plan = await Plan.create({
        user: req.user.id,
        date: targetDate,
        topics: []
      });
    }

    res.status(200).json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('❌ Error getting plan by date:', error);
    res.status(500).json({
      success: false,
      message: 'Server error loading plan'
    });
  }
};

// @desc    Add topic to plan (today or specific date)
// @route   POST /api/plans/topic
// @access  Private
exports.addTopic = async (req, res) => {
  try {
    const { topicName, notes, category, priority, estimatedMinutes, actualMinutes, date } = req.body;
    
    if (!topicName || !topicName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a topic name'
      });
    }

    const targetDate = normalizeDate(date);
    const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    let plan = await Plan.findOne({
      user: req.user.id,
      date: { $gte: targetDate, $lt: nextDate }
    });

    if (!plan) {
      plan = await Plan.create({
        user: req.user.id,
        date: targetDate,
        topics: []
      });
    }

    const newTopic = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
      name: topicName.trim(),
      notes: notes ? notes.trim() : '',
      category: category || 'General',
      priority: priority || 'Medium',
      estimatedMinutes: Number(estimatedMinutes) || 30,
      actualMinutes: Number(actualMinutes) || 0,
      completed: false
    };

    plan.topics.push(newTopic);
    await plan.save();

    res.status(201).json({
      success: true,
      topic: newTopic,
      plan
    });
  } catch (error) {
    console.error('❌ Error adding topic:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding topic'
    });
  }
};

// @desc    Update topic
// @route   PUT /api/plans/topic/:topicId
// @access  Private
exports.updateTopic = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { name, notes, category, priority, estimatedMinutes, actualMinutes, completed, date } = req.body;

    const targetDate = date ? normalizeDate(date) : null;

    let plan;
    if (targetDate) {
      const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);
      plan = await Plan.findOne({
        user: req.user.id,
        date: { $gte: targetDate, $lt: nextDate }
      });
    } else {
      // Find plan containing topic
      plan = await Plan.findOne({
        user: req.user.id,
        'topics.id': topicId
      });
    }

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    const topicIndex = plan.topics.findIndex(t => t.id === topicId);
    if (topicIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    if (name !== undefined) plan.topics[topicIndex].name = name.trim();
    if (notes !== undefined) plan.topics[topicIndex].notes = notes.trim();
    if (category !== undefined) plan.topics[topicIndex].category = category;
    if (priority !== undefined) plan.topics[topicIndex].priority = priority;
    if (estimatedMinutes !== undefined) plan.topics[topicIndex].estimatedMinutes = Number(estimatedMinutes);
    if (actualMinutes !== undefined) plan.topics[topicIndex].actualMinutes = Number(actualMinutes);
    if (completed !== undefined) plan.topics[topicIndex].completed = Boolean(completed);

    await plan.save();

    res.status(200).json({
      success: true,
      topic: plan.topics[topicIndex],
      plan
    });
  } catch (error) {
    console.error('❌ Error updating topic:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating topic'
    });
  }
};

// @desc    Delete topic
// @route   DELETE /api/plans/topic/:topicId
// @access  Private
exports.deleteTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const plan = await Plan.findOne({
      user: req.user.id,
      'topics.id': topicId
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    plan.topics = plan.topics.filter(t => t.id !== topicId);
    await plan.save();

    res.status(200).json({
      success: true,
      message: 'Topic deleted successfully',
      plan
    });
  } catch (error) {
    console.error('❌ Error deleting topic:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting topic'
    });
  }
};

// @desc    Get all plans for user with date range or history
// @route   GET /api/plans/range/:startDate/:endDate
// @access  Private
exports.getPlansRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const start = normalizeDate(startDate);
    const end = normalizeDate(endDate);
    end.setHours(23, 59, 59, 999);

    const plans = await Plan.find({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    }).populate('summary').sort({ date: -1 });

    res.status(200).json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('❌ Error getting plans range:', error);
    res.status(500).json({
      success: false,
      message: 'Server error loading plans'
    });
  }
};