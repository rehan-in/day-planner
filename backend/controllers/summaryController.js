// controllers/summaryController.js
const Summary = require('../models/Summary');
const Plan = require('../models/Plan');

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

// @desc    Create or update today's or specified date's summary
// @route   POST /api/summaries
// @access  Private
exports.createSummary = async (req, res) => {
  try {
    console.log('📝 Creating summary for user:', req.user.id);
    console.log('📦 Summary data:', req.body);

    const {
      completedToday,
      learnedToday,
      biggestAchievement,
      biggestMistakes,
      distractions,
      reviseTomorrow,
      goalTomorrow,
      mood,
      rating,
      date
    } = req.body;

    // Validate required fields
    if (!completedToday || !learnedToday || !biggestAchievement || 
        !biggestMistakes || !distractions || !reviseTomorrow || 
        !goalTomorrow || !mood || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const targetDate = normalizeDate(date);
    const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    // Get plan for target date - CREATE ONE IF IT DOESN'T EXIST
    let plan = await Plan.findOne({
      user: req.user.id,
      date: {
        $gte: targetDate,
        $lt: nextDate
      }
    });

    // If no plan exists, create one automatically
    if (!plan) {
      console.log('📝 No plan found for date, creating one automatically...');
      plan = await Plan.create({
        user: req.user.id,
        date: targetDate,
        topics: []
      });
      console.log('✅ Auto-created plan:', plan._id);
    }

    // Check if summary already exists
    let summary = await Summary.findOne({
      user: req.user.id,
      plan: plan._id
    });

    if (summary) {
      // Update existing summary
      console.log('📝 Updating existing summary...');
      summary.completedToday = completedToday;
      summary.learnedToday = learnedToday;
      summary.biggestAchievement = biggestAchievement;
      summary.biggestMistakes = biggestMistakes;
      summary.distractions = distractions;
      summary.reviseTomorrow = reviseTomorrow;
      summary.goalTomorrow = goalTomorrow;
      summary.mood = mood;
      summary.rating = rating;
      summary.date = targetDate;
    } else {
      // Create new summary
      console.log('📝 Creating new summary...');
      summary = new Summary({
        user: req.user.id,
        plan: plan._id,
        date: targetDate,
        completedToday,
        learnedToday,
        biggestAchievement,
        biggestMistakes,
        distractions,
        reviseTomorrow,
        goalTomorrow,
        mood,
        rating
      });
    }

    await summary.save();
    console.log('✅ Summary saved successfully:', summary._id);

    // Update plan with summary reference
    plan.summary = summary._id;
    await plan.save();

    res.status(201).json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('❌ Summary creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get today's summary
// @route   GET /api/summaries/today
// @access  Private
exports.getTodaySummary = async (req, res) => {
  try {
    const today = normalizeDate();
    const nextDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const summary = await Summary.findOne({
      user: req.user.id,
      date: {
        $gte: today,
        $lt: nextDate
      }
    }).populate('plan');

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: 'No summary found for today'
      });
    }

    res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('❌ Get summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get summary by date
// @route   GET /api/summaries/:date
// @access  Private
exports.getSummaryByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = normalizeDate(date);
    const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    const summary = await Summary.findOne({
      user: req.user.id,
      date: {
        $gte: targetDate,
        $lt: nextDate
      }
    }).populate('plan');

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: 'No summary found for this date'
      });
    }

    res.status(200).json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('❌ Get summary by date error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all summaries for user with pagination
// @route   GET /api/summaries/all
// @access  Private
exports.getAllSummaries = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const startIndex = (page - 1) * limit;

    const total = await Summary.countDocuments({ user: req.user.id });

    const summaries = await Summary.find({
      user: req.user.id
    })
    .populate('plan')
    .sort({ date: -1 })
    .skip(startIndex)
    .limit(limit);

    res.status(200).json({
      success: true,
      count: summaries.length,
      total,
      pages: Math.ceil(total / limit) || 1,
      currentPage: page,
      summaries
    });
  } catch (error) {
    console.error('❌ Get all summaries error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};