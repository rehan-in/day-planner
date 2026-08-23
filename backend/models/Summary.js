// models/Summary.js
const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  completedToday: {
    type: String,
    required: [true, 'Please share what you completed today'],
    maxlength: [500, 'Cannot exceed 500 characters']
  },
  learnedToday: {
    type: String,
    required: [true, 'Please share what you learned today'],
    maxlength: [500, 'Cannot exceed 500 characters']
  },
  biggestAchievement: {
    type: String,
    required: [true, 'Please share your biggest achievement'],
    maxlength: [500, 'Cannot exceed 500 characters']
  },
  biggestMistakes: {
    type: String,
    required: [true, 'Please share your biggest mistakes'],
    maxlength: [500, 'Cannot exceed 500 characters']
  },
  distractions: {
    type: String,
    required: [true, 'Please share what distracted you'],
    maxlength: [500, 'Cannot exceed 500 characters']
  },
  reviseTomorrow: {
    type: String,
    required: [true, 'Please share what to revise tomorrow'],
    maxlength: [500, 'Cannot exceed 500 characters']
  },
  goalTomorrow: {
    type: String,
    required: [true, 'Please set a goal for tomorrow'],
    maxlength: [500, 'Cannot exceed 500 characters']
  },
  mood: {
    type: String,
    required: [true, 'Please select your mood'],
    enum: ['😊 Happy', '😐 Neutral', '😔 Sad', '😡 Angry', '😄 Excited', '😌 Calm', '😰 Anxious']
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
summarySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Summary', summarySchema);