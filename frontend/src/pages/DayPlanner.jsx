// src/pages/DayPlanner.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Card,
  CardContent,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip
} from '@mui/material';
import PomodoroTimer from '../components/PomodoroTimer';
import {
  Add,
  Delete,
  Edit,
  Save,
  CheckCircle,
  RadioButtonUnchecked,
  CalendarMonth,
  Today,
  PriorityHigh,
  Notes,
  Timer,
  FitnessCenter,
  MenuBook,
  SelfImprovement,
  Code
} from '@mui/icons-material';

const DayPlanner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [plan, setPlan] = useState(null);
  const [topics, setTopics] = useState([]);
  
  const [newTopic, setNewTopic] = useState({ 
    name: '', 
    notes: '',
    category: 'Work',
    priority: 'Medium',
    estimatedMinutes: 30,
    actualMinutes: 0
  });

  const [editingTopic, setEditingTopic] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);

  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const [pomodoroTaskName, setPomodoroTaskName] = useState('');

  const handleStartPomodoroForTask = (taskName) => {
    setPomodoroTaskName(taskName);
    setPomodoroOpen(true);
  };

  useEffect(() => {
    fetchPlanForDate(selectedDate);
  }, [selectedDate]);

  const fetchPlanForDate = async (dateStr) => {
    setLoading(true);
    try {
      const response = await api.get(`/plans/date/${dateStr}`);
      if (response.data.success) {
        setPlan(response.data.plan);
        setTopics(response.data.plan.topics || []);
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
      toast.error('Failed to load plan for selected date');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = async () => {
    if (!newTopic.name.trim()) {
      toast.error('Please enter a topic name');
      return;
    }

    try {
      const response = await api.post('/plans/topic', {
        topicName: newTopic.name,
        notes: newTopic.notes,
        category: newTopic.category,
        priority: newTopic.priority,
        estimatedMinutes: newTopic.estimatedMinutes,
        date: selectedDate
      });

      if (response.data.success) {
        setTopics([...topics, response.data.topic]);
        setNewTopic({
          name: '',
          notes: '',
          category: 'Work',
          priority: 'Medium',
          estimatedMinutes: 30
        });
        toast.success('Topic added successfully! 🎯');
      }
    } catch (error) {
      console.error('Add topic error:', error);
      toast.error(error.response?.data?.message || 'Failed to add topic');
    }
  };

  const handleToggleComplete = async (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;

    try {
      const response = await api.put(`/plans/topic/${topicId}`, {
        completed: !topic.completed,
        date: selectedDate
      });

      if (response.data.success) {
        setTopics(topics.map(t => 
          t.id === topicId ? { ...t, completed: !t.completed } : t
        ));
      }
    } catch (error) {
      console.error('Toggle complete error:', error);
      toast.error('Failed to update topic status');
    }
  };

  const handleOpenEditDialog = (topic) => {
    setEditingTopic(topic);
    setNewTopic({
      name: topic.name,
      notes: topic.notes || '',
      category: topic.category || 'Work',
      priority: topic.priority || 'Medium',
      estimatedMinutes: topic.estimatedMinutes || 30
    });
    setDialogOpen(true);
  };

  const handleUpdateTopic = async () => {
    if (!newTopic.name.trim()) {
      toast.error('Please enter a topic name');
      return;
    }

    try {
      const response = await api.put(`/plans/topic/${editingTopic.id}`, {
        name: newTopic.name,
        notes: newTopic.notes,
        category: newTopic.category,
        priority: newTopic.priority,
        estimatedMinutes: newTopic.estimatedMinutes,
        date: selectedDate
      });

      if (response.data.success) {
        setTopics(topics.map(t => 
          t.id === editingTopic.id ? { ...t, ...newTopic } : t
        ));
        setDialogOpen(false);
        setEditingTopic(null);
        setNewTopic({
          name: '',
          notes: '',
          category: 'Work',
          priority: 'Medium',
          estimatedMinutes: 30
        });
        toast.success('Topic updated successfully');
      }
    } catch (error) {
      console.error('Update topic error:', error);
      toast.error('Failed to update topic');
    }
  };

  const handleDeleteClick = (topicId) => {
    setTopicToDelete(topicId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await api.delete(`/plans/topic/${topicToDelete}`);
      if (response.data.success) {
        setTopics(topics.filter(t => t.id !== topicToDelete));
        setDeleteDialogOpen(false);
        setTopicToDelete(null);
        toast.success('Topic deleted successfully');
      }
    } catch (error) {
      console.error('Delete topic error:', error);
      toast.error('Failed to delete topic');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  const completedCount = topics.filter(t => t.completed).length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f9', pb: 6 }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Header & Date Picker Bar */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 4, 
            bgcolor: 'white',
            border: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" color="#1e2749">
              Day Planner
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Organize your goals, tasks, and topics for the day
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              type="date"
              label="Selected Date"
              size="small"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: '#f8f9fa', borderRadius: 2 }}
            />

            <Button
              variant="outlined"
              size="small"
              startIcon={<Today />}
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Today
            </Button>

            <Chip 
              label={`${completedCount} / ${topics.length} Done`}
              color={completedCount === topics.length && topics.length > 0 ? "success" : "primary"}
              sx={{ fontWeight: 600, py: 2 }}
            />
          </Box>
        </Paper>

        {/* Add Topic Form */}
        <Card 
          elevation={0} 
          sx={{ 
            mb: 4, 
            borderRadius: 4, 
            bgcolor: 'white',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" color="#1e2749">
                ➕ Add New Topic / Task
              </Typography>

              {/* Quick Routine Preset Buttons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Quick Routines:
                </Typography>
                <Chip
                  icon={<FitnessCenter style={{ fontSize: 16 }} />}
                  label="Fitness Workout (30m)"
                  size="small"
                  onClick={() => setNewTopic({ name: '🏋️ Morning Workout', notes: '30 mins cardio & strength', category: 'Fitness', priority: 'High', estimatedMinutes: 30, actualMinutes: 0 })}
                  sx={{ cursor: 'pointer', bgcolor: '#e8f5e9', color: '#2e7d32' }}
                />
                <Chip
                  icon={<MenuBook style={{ fontSize: 16 }} />}
                  label="Reading (30m)"
                  size="small"
                  onClick={() => setNewTopic({ name: '📚 Read 30 Mins', notes: 'Read tech docs / book', category: 'Study', priority: 'Medium', estimatedMinutes: 30, actualMinutes: 0 })}
                  sx={{ cursor: 'pointer', bgcolor: '#e3f2fd', color: '#1976d2' }}
                />
                <Chip
                  icon={<SelfImprovement style={{ fontSize: 16 }} />}
                  label="Meditation (15m)"
                  size="small"
                  onClick={() => setNewTopic({ name: '🧘 Mindfulness Meditation', notes: '15 mins breathing exercise', category: 'Personal', priority: 'Low', estimatedMinutes: 15, actualMinutes: 0 })}
                  sx={{ cursor: 'pointer', bgcolor: '#f3e5f5', color: '#7b1fa2' }}
                />
                <Chip
                  icon={<Code style={{ fontSize: 16 }} />}
                  label="Code Review (45m)"
                  size="small"
                  onClick={() => setNewTopic({ name: '💻 Code Review & Refactoring', notes: 'Review pull requests', category: 'Work', priority: 'High', estimatedMinutes: 45, actualMinutes: 0 })}
                  sx={{ cursor: 'pointer', bgcolor: '#fff3e0', color: '#e65100' }}
                />
              </Box>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Topic Name"
                  placeholder="e.g. Master React Context API"
                  value={newTopic.name}
                  onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  placeholder="e.g. Read docs & code custom hook"
                  value={newTopic.notes}
                  onChange={(e) => setNewTopic({ ...newTopic, notes: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTopic()}
                />
              </Grid>

              <Grid item xs={6} md={1.5}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newTopic.category}
                    label="Category"
                    onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                  >
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Work">Work</MenuItem>
                    <MenuItem value="Study">Study</MenuItem>
                    <MenuItem value="Personal">Personal</MenuItem>
                    <MenuItem value="Fitness">Fitness</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={1.5}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newTopic.priority}
                    label="Priority"
                    onChange={(e) => setNewTopic({ ...newTopic, priority: e.target.value })}
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Add />}
                  onClick={handleAddTopic}
                  sx={{ 
                    py: 1.2,
                    bgcolor: '#273469',
                    '&:hover': { bgcolor: '#1e2749' },
                    borderRadius: 3,
                    fontWeight: 600
                  }}
                >
                  Add Topic to Plan
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Topics List */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 4, 
              bgcolor: 'white',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              overflow: 'hidden'
            }}
          >
            {topics.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No topics planned for this date.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your first task above to kickstart your productivity! 🚀
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {topics.map((topic, index) => (
                  <React.Fragment key={topic.id || index}>
                    {index > 0 && <Divider />}
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        bgcolor: topic.completed ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
                        transition: 'background-color 0.2s',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.03)' }
                      }}
                    >
                      <Checkbox
                        checked={topic.completed}
                        onChange={() => handleToggleComplete(topic.id)}
                        icon={<RadioButtonUnchecked />}
                        checkedIcon={<CheckCircle sx={{ color: '#2e7d32' }} />}
                        sx={{ mr: 1 }}
                      />

                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={topic.completed ? 400 : 600}
                              sx={{
                                textDecoration: topic.completed ? 'line-through' : 'none',
                                color: topic.completed ? 'text.secondary' : '#1e2749'
                              }}
                            >
                              {topic.name}
                            </Typography>

                            <Chip 
                              label={topic.priority || 'Medium'} 
                              size="small" 
                              color={getPriorityColor(topic.priority)}
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />

                            <Chip 
                              label={topic.category || 'General'} 
                              size="small" 
                              sx={{ height: 20, fontSize: '0.7rem', bgcolor: '#eef2ff', color: '#4e54c8' }}
                            />

                            <Chip 
                              icon={<Timer style={{ fontSize: 12 }} />}
                              label={`${topic.actualMinutes || 0}m / ${topic.estimatedMinutes || 30}m`} 
                              size="small" 
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          </Box>
                        }
                        secondary={
                          topic.notes ? (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              📝 {topic.notes}
                            </Typography>
                          ) : null
                        }
                      />

                      <ListItemSecondaryAction>
                        <Tooltip title="Start Focus Pomodoro">
                          <IconButton onClick={() => handleStartPomodoroForTask(topic.name)} size="small" color="primary" sx={{ mr: 1 }}>
                            <Timer fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleOpenEditDialog(topic)} size="small" sx={{ mr: 1 }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDeleteClick(topic.id)} size="small" color="error">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        )}

        {/* Edit Topic Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Topic</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Topic Name"
                value={newTopic.name}
                onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={newTopic.notes}
                onChange={(e) => setNewTopic({ ...newTopic, notes: e.target.value })}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={newTopic.category}
                      label="Category"
                      onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                    >
                      <MenuItem value="General">General</MenuItem>
                      <MenuItem value="Work">Work</MenuItem>
                      <MenuItem value="Study">Study</MenuItem>
                      <MenuItem value="Personal">Personal</MenuItem>
                      <MenuItem value="Fitness">Fitness</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={newTopic.priority}
                      label="Priority"
                      onChange={(e) => setNewTopic({ ...newTopic, priority: e.target.value })}
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleUpdateTopic}
              startIcon={<Save />}
              sx={{ bgcolor: '#273469' }}
            >
              Update Topic
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Topic</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this topic from your plan?</Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="contained" 
              color="error" 
              onClick={confirmDelete}
              startIcon={<Delete />}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Pomodoro Timer Modal */}
        <PomodoroTimer 
          open={pomodoroOpen} 
          onClose={() => setPomodoroOpen(false)} 
          initialTaskName={pomodoroTaskName}
        />
      </Container>
    </Box>
  );
};

export default DayPlanner;