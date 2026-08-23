// src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  TextField,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  CalendarMonth,
  EventNote,
  RateReview,
  Star,
  CheckCircleOutlined,
  Lightbulb,
  TrendingUp,
  Psychology,
  Download,
  Print,
  Search
} from '@mui/icons-material';

const History = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/summaries/all');
      if (response.data.success) {
        setSummaries(response.data.summaries || []);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!summaries || summaries.length === 0) return;
    const headers = ['Date', 'Mood', 'Rating', 'Completed Today', 'Learned Today', 'Biggest Achievement', 'Mistakes', 'Distractions', 'Revise Tomorrow', 'Goal Tomorrow'];
    const rows = summaries.map(s => [
      new Date(s.date).toISOString().split('T')[0],
      `"${s.mood || ''}"`,
      s.rating || 0,
      `"${(s.completedToday || '').replace(/"/g, '""')}"`,
      `"${(s.learnedToday || '').replace(/"/g, '""')}"`,
      `"${(s.biggestAchievement || '').replace(/"/g, '""')}"`,
      `"${(s.biggestMistakes || '').replace(/"/g, '""')}"`,
      `"${(s.distractions || '').replace(/"/g, '""')}"`,
      `"${(s.reviseTomorrow || '').replace(/"/g, '""')}"`,
      `"${(s.goalTomorrow || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dayplanner_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const filteredSummaries = summaries.filter(item => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (item.completedToday && item.completedToday.toLowerCase().includes(term)) ||
      (item.learnedToday && item.learnedToday.toLowerCase().includes(term)) ||
      (item.biggestAchievement && item.biggestAchievement.toLowerCase().includes(term)) ||
      (item.mood && item.mood.toLowerCase().includes(term))
    );
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f9', pb: 6 }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 4, 
            bgcolor: 'white',
            border: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" color="#1e2749">
              Planner & Reflection History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Browse, search, and export your daily achievements & reflections
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: '#f8f9fa', borderRadius: 2 }}
            />

            <Button
              variant="outlined"
              size="small"
              startIcon={<Download />}
              onClick={handleExportCSV}
              disabled={summaries.length === 0}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
            >
              Export CSV
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={<Print />}
              onClick={handlePrintPDF}
              disabled={summaries.length === 0}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, bgcolor: '#273469' }}
            >
              Print / Save PDF
            </Button>
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : summaries.length === 0 ? (
          <Paper 
            elevation={0}
            sx={{ p: 6, textAlign: 'center', borderRadius: 4, bgcolor: 'white' }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No history recorded yet!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start filling out daily plans and summaries to track your progress over time.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/planner')}
              sx={{ bgcolor: '#273469', borderRadius: 3 }}
            >
              Go to Today's Planner
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredSummaries.map((item) => {
              const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <Accordion 
                  key={item._id}
                  elevation={0}
                  sx={{ 
                    borderRadius: '16px !important', 
                    border: '1px solid rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    '&:before': { display: 'none' }
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CalendarMonth sx={{ color: '#273469' }} />
                        <Typography variant="subtitle1" fontWeight="bold" color="#1e2749">
                          {formattedDate}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Chip label={item.mood} size="small" />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Star sx={{ color: '#f57c00', fontSize: 18 }} />
                          <Typography variant="body2" fontWeight="bold">
                            {item.rating}/10
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 3, bgcolor: '#fafafa', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                            <CheckCircleOutlined sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            Completed Today:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.completedToday}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="warning.main" fontWeight="bold" gutterBottom>
                            <Lightbulb sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            Learned Today:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.learnedToday}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="info.main" fontWeight="bold" gutterBottom>
                            <TrendingUp sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            Biggest Achievement:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.biggestAchievement}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="error.main" fontWeight="bold" gutterBottom>
                            Biggest Mistakes & Distractions:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.biggestMistakes} (Distractions: {item.distractions})
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" color="secondary.main" fontWeight="bold" gutterBottom>
                            <Psychology sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            To Revise Tomorrow:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.reviseTomorrow}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="subtitle2" color="success.main" fontWeight="bold" gutterBottom>
                            <Star sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                            Goal for Tomorrow:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.goalTomorrow}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {item.plan && item.plan.topics && item.plan.topics.length > 0 && (
                      <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed #e0e0e0' }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="#1e2749" gutterBottom>
                          📋 Planned Topics for this Day ({item.plan.topics.filter(t => t.completed).length}/{item.plan.topics.length} done):
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          {item.plan.topics.map((t, idx) => (
                            <Chip 
                              key={idx}
                              label={t.name}
                              size="small"
                              color={t.completed ? 'success' : 'default'}
                              variant={t.completed ? 'filled' : 'outlined'}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default History;
