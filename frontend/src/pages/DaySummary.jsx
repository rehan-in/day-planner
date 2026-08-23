// src/pages/DaySummary.jsx
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
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert
} from '@mui/material';
import {
  Send,
  EmojiEmotions,
  TrendingUp,
  CheckCircle,
  Error as ErrorIcon,
  Lightbulb,
  Psychology,
  Star,
  Mood,
  Today
} from '@mui/icons-material';

const DaySummary = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [summary, setSummary] = useState(null);
  const [formData, setFormData] = useState({
    completedToday: '',
    learnedToday: '',
    biggestAchievement: '',
    biggestMistakes: '',
    distractions: '',
    reviseTomorrow: '',
    goalTomorrow: '',
    mood: '',
    rating: 5
  });

  useEffect(() => {
    fetchSummaryForDate(selectedDate);
  }, [selectedDate]);

  const fetchSummaryForDate = async (dateStr) => {
    setLoading(true);
    try {
      const response = await api.get(`/summaries/${dateStr}`);
      if (response.data.success && response.data.summary) {
        const sum = response.data.summary;
        setSummary(sum);
        setFormData({
          completedToday: sum.completedToday || '',
          learnedToday: sum.learnedToday || '',
          biggestAchievement: sum.biggestAchievement || '',
          biggestMistakes: sum.biggestMistakes || '',
          distractions: sum.distractions || '',
          reviseTomorrow: sum.reviseTomorrow || '',
          goalTomorrow: sum.goalTomorrow || '',
          mood: sum.mood || '😊 Happy',
          rating: sum.rating || 5
        });
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setSummary(null);
        setFormData({
          completedToday: '',
          learnedToday: '',
          biggestAchievement: '',
          biggestMistakes: '',
          distractions: '',
          reviseTomorrow: '',
          goalTomorrow: '',
          mood: '😊 Happy',
          rating: 5
        });
      } else {
        console.error('Error fetching summary:', error);
        toast.error('Failed to load summary');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = [
      'completedToday', 'learnedToday', 'biggestAchievement', 
      'biggestMistakes', 'distractions', 'reviseTomorrow', 
      'goalTomorrow', 'mood'
    ];
    
    for (let field of requiredFields) {
      if (!formData[field] || !formData[field].trim()) {
        toast.error('Please complete all reflection questions');
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await api.post('/summaries', {
        ...formData,
        date: selectedDate
      });

      if (response.data.success) {
        setSummary(response.data.summary);
        toast.success('Daily Summary saved successfully! 🎉');
        setTimeout(() => navigate('/'), 1200);
      }
    } catch (error) {
      console.error('Error saving summary:', error);
      toast.error(error.response?.data?.message || 'Failed to save summary');
    } finally {
      setSubmitting(false);
    }
  };

  const questions = [
    {
      key: 'completedToday',
      label: 'What did I complete today?',
      icon: <CheckCircle />,
      placeholder: 'List the tasks and goals achieved today...',
      color: '#2e7d32'
    },
    {
      key: 'learnedToday',
      label: 'What key lessons did I learn?',
      icon: <Lightbulb />,
      placeholder: 'Share new insights, skills, or realizations...',
      color: '#ed6c02'
    },
    {
      key: 'biggestAchievement',
      label: 'What was my biggest achievement?',
      icon: <TrendingUp />,
      placeholder: 'Highlight your top win of the day...',
      color: '#1976d2'
    },
    {
      key: 'biggestMistakes',
      label: 'What mistakes were made & what can I improve?',
      icon: <ErrorIcon />,
      placeholder: 'Reflect on setbacks and how to avoid them...',
      color: '#d32f2f'
    },
    {
      key: 'distractions',
      label: 'What distracted me today?',
      icon: <EmojiEmotions />,
      placeholder: 'Identify time-wasters and distractions...',
      color: '#9c27b0'
    },
    {
      key: 'reviseTomorrow',
      label: 'What topics should I revise tomorrow?',
      icon: <Psychology />,
      placeholder: 'List concepts that need review tomorrow...',
      color: '#00695c'
    },
    {
      key: 'goalTomorrow',
      label: 'What is my main goal for tomorrow?',
      icon: <Star />,
      placeholder: 'Set a clear, focused target for tomorrow...',
      color: '#f57c00'
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f9', pb: 6 }}>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Header Bar */}
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
              Day Summary & Reflection
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review your day, extract key learnings, and build daily momentum
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              type="date"
              label="Reflection Date"
              size="small"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: '#f8f9fa', borderRadius: 2 }}
            />
            {summary && (
              <Chip label="Saved" color="success" size="small" sx={{ fontWeight: 600 }} />
            )}
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {questions.map((q) => (
                <Grid item xs={12} key={q.key}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      borderRadius: 4, 
                      bgcolor: 'white',
                      border: '1px solid rgba(0,0,0,0.06)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{ color: q.color }}>{q.icon}</Box>
                        <Typography variant="subtitle1" fontWeight="600" color="#1e2749">
                          {q.label}
                        </Typography>
                      </Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        name={q.key}
                        value={formData[q.key] || ''}
                        onChange={handleChange}
                        placeholder={q.placeholder}
                        variant="outlined"
                        required
                        sx={{ bgcolor: '#fafafa', borderRadius: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              {/* Mood & Rating */}
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 4, 
                    bgcolor: 'white',
                    height: '100%',
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Mood sx={{ color: '#7b1fa2' }} />
                      <Typography variant="subtitle1" fontWeight="600" color="#1e2749">
                        Overall Mood
                      </Typography>
                    </Box>
                    <FormControl fullWidth>
                      <InputLabel>Select your mood</InputLabel>
                      <Select
                        name="mood"
                        value={formData.mood}
                        onChange={handleChange}
                        label="Select your mood"
                        required
                      >
                        <MenuItem value="😊 Happy">😊 Happy</MenuItem>
                        <MenuItem value="😄 Excited">😄 Excited</MenuItem>
                        <MenuItem value="😌 Calm">😌 Calm</MenuItem>
                        <MenuItem value="😐 Neutral">😐 Neutral</MenuItem>
                        <MenuItem value="😔 Sad">😔 Sad</MenuItem>
                        <MenuItem value="😡 Angry">😡 Angry</MenuItem>
                        <MenuItem value="😰 Anxious">😰 Anxious</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 4, 
                    bgcolor: 'white',
                    height: '100%',
                    border: '1px solid rgba(0,0,0,0.06)'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Star sx={{ color: '#f9a825' }} />
                      <Typography variant="subtitle1" fontWeight="600" color="#1e2749">
                        Day Rating (1 - 10)
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 1 }}>
                      <Rating
                        name="rating"
                        value={formData.rating}
                        onChange={(e, newValue) => {
                          setFormData(prev => ({ ...prev, rating: newValue || 5 }));
                        }}
                        max={10}
                        precision={1}
                        size="large"
                      />
                      <Typography variant="h6" fontWeight="bold" color="#1e2749">
                        {formData.rating} / 10
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={submitting}
                  startIcon={<Send />}
                  sx={{
                    py: 1.8,
                    bgcolor: '#273469',
                    '&:hover': { bgcolor: '#1e2749' },
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 600
                  }}
                >
                  {submitting ? 'Saving Summary...' : summary ? 'Update Summary' : 'Save Day Summary'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Container>
    </Box>
  );
};

export default DaySummary;