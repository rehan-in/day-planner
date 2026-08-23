// models/Plan.js
const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a topic name'],
    trim: true,
    maxlength: [120, 'Topic name cannot exceed 120 characters']
  },
  notes: {
    type: String,
    default: '',
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['General', 'Work', 'Study', 'Personal', 'Fitness', 'Other'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  estimatedMinutes: {
    type: Number,
    min: 0,
    max: 1440,
    default: 30
  },
  actualMinutes: {
    type: Number,
    min: 0,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const planSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  topics: [topicSchema],
  summary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Summary'
  }
}, {
  timestamps: true
});

planSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Plan', planSchema);