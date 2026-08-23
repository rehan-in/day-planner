// controllers/statsController.js
const Plan = require('../models/Plan');
const Summary = require('../models/Summary');

// @desc    Get dashboard statistics for the logged-in user
// @route   GET /api/stats
// @access  Private
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Today boundaries
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Get today's plan
    const todayPlan = await Plan.findOne({
      user: userId,
      date: { $gte: todayStart, $lt: todayEnd }
    });

    const todayTopics = todayPlan ? todayPlan.topics : [];
    const todayTopicsCount = todayTopics.length;
    const todayCompletedCount = todayTopics.filter(t => t.completed).length;

    // Total unique days tracked (count plans or summaries)
    const totalPlansCount = await Plan.countDocuments({ user: userId });
    const totalSummariesCount = await Summary.countDocuments({ user: userId });
    const daysTracked = Math.max(totalPlansCount, totalSummariesCount);

    // Calculate total completed vs total assigned across all plans
    const allPlans = await Plan.find({ user: userId });
    let totalAssignedTopics = 0;
    let totalCompletedTopics = 0;

    allPlans.forEach(plan => {
      totalAssignedTopics += plan.topics.length;
      totalCompletedTopics += plan.topics.filter(t => t.completed).length;
    });

    const completionRate = totalAssignedTopics > 0 
      ? Math.round((totalCompletedTopics / totalAssignedTopics) * 100) 
      : 0;

    // Calculate current daily streak
    let streak = 0;
    let checkDate = new Date(todayStart);

    // First check if today has plan or summary
    const todayPlanExist = (todayPlan && todayPlan.topics && todayPlan.topics.length > 0) || false;
    const todaySummaryExist = await Summary.exists({
      user: userId,
      date: { $gte: todayStart, $lt: todayEnd }
    });

    if (!todayPlanExist && !todaySummaryExist) {
      // If nothing done today yet, start checking streak backwards from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const nextDate = new Date(checkDate.getTime() + 24 * 60 * 60 * 1000);
      const planExist = await Plan.exists({
        user: userId,
        date: { $gte: checkDate, $lt: nextDate },
        'topics.0': { $exists: true }
      });
      const summaryExist = await Summary.exists({
        user: userId,
        date: { $gte: checkDate, $lt: nextDate }
      });

      if (planExist || summaryExist) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Get today's summary status
    const todaySummary = await Summary.findOne({
      user: userId,
      date: { $gte: todayStart, $lt: todayEnd }
    });

    // Recent 5 summaries for mood trend
    const recentSummaries = await Summary.find({ user: userId })
      .sort({ date: -1 })
      .limit(5)
      .select('date mood rating goalTomorrow reviseTomorrow');

    res.status(200).json({
      success: true,
      stats: {
        daysTracked,
        todayTopicsCount,
        todayCompletedCount,
        completionRate,
        streak,
        hasSubmittedTodaySummary: !!todaySummary,
        todayMood: todaySummary ? todaySummary.mood : null,
        todayRating: todaySummary ? todaySummary.rating : null,
        recentSummaries
      }
    });
  } catch (error) {
    console.error('❌ Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
};
