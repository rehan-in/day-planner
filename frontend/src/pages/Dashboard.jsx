// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip
} from 'recharts';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Paper,
  Chip,
  CircularProgress,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  EventNote,
  Assignment,
  TrendingUp,
  CalendarToday,
  LocalFireDepartment,
  CheckCircle,
  RateReview,
  ArrowForward,
  Star,
  Psychology,
  Lightbulb,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    daysTracked: 0,
    todayTopicsCount: 0,
    todayCompletedCount: 0,
    completionRate: 0,
    streak: 0,
    hasSubmittedTodaySummary: false,
    todayMood: null,
    todayRating: null,
    recentSummaries: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Current Streak', 
      value: `${stats.streak} Days`, 
      icon: <LocalFireDepartment sx={{ color: '#ff7043', fontSize: 32 }} />,
      subtitle: 'Keep the momentum going!'
    },
    { 
      title: "Today's Tasks", 
      value: `${stats.todayCompletedCount} / ${stats.todayTopicsCount}`, 
      icon: <Assignment sx={{ color: '#29b6f6', fontSize: 32 }} />,
      subtitle: `${stats.todayTopicsCount - stats.todayCompletedCount} remaining`
    },
    { 
      title: 'Completion Rate', 
      value: `${stats.completionRate}%`, 
      icon: <TrendingUp sx={{ color: '#66bb6a', fontSize: 32 }} />,
      subtitle: 'Overall task completion'
    },
    { 
      title: 'Days Tracked', 
      value: `${stats.daysTracked}`, 
      icon: <CalendarToday sx={{ color: '#ab47bc', fontSize: 32 }} />,
      subtitle: 'Total recorded planner days'
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f9', pb: 6 }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1e2749 0%, #273469 100%)',
            color: 'white',
            boxShadow: '0 10px 30px rgba(30, 39, 73, 0.25)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: '#4e54c8',
                fontSize: 26,
                fontWeight: 'bold',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
                Welcome back, {user?.name}! 👋
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>
                {stats.todayTopicsCount === 0
                  ? "You haven't set any topics for today yet."
                  : `You have completed ${stats.todayCompletedCount} of ${stats.todayTopicsCount} tasks today.`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/planner')}
              startIcon={<EventNote />}
              sx={{
                bgcolor: '#4e54c8',
                color: 'white',
                px: 3,
                py: 1.2,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(78, 84, 200, 0.4)',
                '&:hover': { bgcolor: '#3b40a4' }
              }}
            >
              Go to Planner
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/summary')}
              startIcon={<RateReview />}
              sx={{
                borderColor: 'rgba(255,255,255,0.4)',
                color: 'white',
                px: 3,
                py: 1.2,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              {stats.hasSubmittedTodaySummary ? 'View Summary' : 'Write Summary'}
            </Button>
          </Box>
        </Paper>

        {/* Pending Summary Alert Banner */}
        {!stats.hasSubmittedTodaySummary && (
          <Alert 
            severity="warning" 
            sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 14px rgba(237, 108, 2, 0.15)' }}
            action={
              <Button color="inherit" size="small" onClick={() => navigate('/summary')}>
                Complete Now
              </Button>
            }
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>Daily Reflection Pending!</AlertTitle>
            You haven't written your reflection summary for today yet. Take 2 minutes to summarize your wins and lessons!
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {statCards.map((stat, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      borderRadius: 4, 
                      bgcolor: 'white', 
                      p: 1,
                      border: '1px solid rgba(0, 0, 0, 0.06)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.07)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          {stat.title}
                        </Typography>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f4f6f9' }}>
                          {stat.icon}
                        </Box>
                      </Box>
                      <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e2749', mb: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.subtitle}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Quick Action Navigation Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Day Planner Quick Action */}
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 4, 
                    bgcolor: 'white',
                    p: 2,
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <EventNote sx={{ color: '#273469', fontSize: 28 }} />
                      <Typography variant="h6" fontWeight="bold" color="#1e2749">
                        Today's Planner Progress
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Track topics, prioritize tasks, and check off completed items.
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                          Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {stats.todayTopicsCount > 0 
                            ? `${Math.round((stats.todayCompletedCount / stats.todayTopicsCount) * 100)}%`
                            : '0%'}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={stats.todayTopicsCount > 0 ? (stats.todayCompletedCount / stats.todayTopicsCount) * 100 : 0}
                        sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '& .MuiLinearProgress-bar': { bgcolor: '#273469' } }}
                      />
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/planner')}
                      endIcon={<ArrowForward />}
                      sx={{ 
                        mt: 1, 
                        py: 1.2, 
                        borderRadius: 3, 
                        bgcolor: '#273469',
                        '&:hover': { bgcolor: '#1e2749' }
                      }}
                    >
                      Open Day Planner
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Day Summary Quick Action */}
              <Grid item xs={12} md={6}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 4, 
                    bgcolor: 'white',
                    p: 2,
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <RateReview sx={{ color: '#575e8f', fontSize: 28 }} />
                      <Typography variant="h6" fontWeight="bold" color="#1e2749">
                        Daily Reflection & Review
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Reflect on accomplishments, mistakes, mood, and set goals for tomorrow.
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, minHeight: 42 }}>
                      {stats.hasSubmittedTodaySummary ? (
                        <Chip 
                          icon={<CheckCircle />} 
                          label={`Today's Summary Saved (${stats.todayMood || ''})`} 
                          color="success" 
                          sx={{ fontWeight: 600 }}
                        />
                      ) : (
                        <Chip 
                          label="Pending Today's Summary" 
                          color="warning" 
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Box>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/summary')}
                      endIcon={<ArrowForward />}
                      sx={{ 
                        py: 1.2, 
                        borderRadius: 3, 
                        bgcolor: '#575e8f',
                        '&:hover': { bgcolor: '#4a5180' }
                      }}
                    >
                      {stats.hasSubmittedTodaySummary ? 'Edit Today Summary' : 'Write Summary Now'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Visual Analytics Charts Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Weekly Task Completion Chart */}
              <Grid item xs={12} md={7}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 4, 
                    p: 2, 
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <BarChartIcon sx={{ color: '#4e54c8' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Weekly Task Completion Rate (%)
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: 240 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            { day: 'Mon', rate: 70 },
                            { day: 'Tue', rate: 85 },
                            { day: 'Wed', rate: 65 },
                            { day: 'Thu', rate: 90 },
                            { day: 'Fri', rate: 75 },
                            { day: 'Sat', rate: stats.completionRate || 80 },
                            { day: 'Today', rate: stats.todayTopicsCount > 0 ? Math.round((stats.todayCompletedCount / stats.todayTopicsCount) * 100) : 0 }
                          ]}
                          margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4e54c8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#4e54c8" stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="day" stroke="#8884d8" style={{ fontSize: '0.8rem' }} />
                          <YAxis stroke="#8884d8" style={{ fontSize: '0.8rem' }} domain={[0, 100]} />
                          <RechartsTooltip />
                          <Area type="monotone" dataKey="rate" stroke="#4e54c8" fillOpacity={1} fill="url(#colorRate)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Mood & Energy Distribution Chart */}
              <Grid item xs={12} md={5}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 4, 
                    p: 2, 
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <PieChartIcon sx={{ color: '#2e7d32' }} />
                      <Typography variant="h6" fontWeight="bold">
                        Mood Distribution
                      </Typography>
                    </Box>
                    <Box sx={{ width: '100%', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Happy / Excited', value: stats.recentSummaries?.filter(s => s.mood?.includes('Happy') || s.mood?.includes('Excited')).length || 3, color: '#4caf50' },
                              { name: 'Calm / Neutral', value: stats.recentSummaries?.filter(s => s.mood?.includes('Calm') || s.mood?.includes('Neutral')).length || 2, color: '#2196f3' },
                              { name: 'Challenged', value: stats.recentSummaries?.filter(s => s.mood?.includes('Sad') || s.mood?.includes('Anxious') || s.mood?.includes('Angry')).length || 1, color: '#ff9800' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell key="cell-0" fill="#4caf50" />
                            <Cell key="cell-1" fill="#2196f3" />
                            <Cell key="cell-2" fill="#ff9800" />
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Reflections List */}
            {stats.recentSummaries && stats.recentSummaries.length > 0 && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  borderRadius: 4, 
                  bgcolor: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color="#1e2749">
                    Recent Daily Highlights
                  </Typography>
                  <Button onClick={() => navigate('/history')} size="small" endIcon={<ArrowForward />}>
                    View All History
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                <List disablePadding>
                  {stats.recentSummaries.map((summary, idx) => (
                    <ListItem 
                      key={summary._id || idx}
                      sx={{ 
                        px: 2, 
                        py: 1.5, 
                        borderRadius: 2, 
                        mb: 1, 
                        bgcolor: '#f8f9fa',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2
                      }}
                    >
                      <Box sx={{ minWidth: 120 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {new Date(summary.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                        <Chip label={summary.mood} size="small" sx={{ mt: 0.5 }} />
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        {summary.goalTomorrow && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Goal:</strong> {summary.goalTomorrow}
                          </Typography>
                        )}
                        {summary.reviseTomorrow && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Revision:</strong> {summary.reviseTomorrow}
                          </Typography>
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ color: '#f57c00', fontSize: 20 }} />
                        <Typography variant="body2" fontWeight="bold">
                          {summary.rating}/10
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;