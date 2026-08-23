// src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Container,
  Chip
} from '@mui/material';
import { useThemeMode } from '../context/ThemeContext';
import PomodoroTimer from './PomodoroTimer';
import {
  Dashboard as DashboardIcon,
  EventNote as EventNoteIcon,
  RateReview as RateReviewIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  CalendarMonth,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [pomodoroOpen, setPomodoroOpen] = useState(false);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Day Planner', path: '/planner', icon: <EventNoteIcon fontSize="small" /> },
    { label: 'Daily Summary', path: '/summary', icon: <RateReviewIcon fontSize="small" /> },
    { label: 'History', path: '/history', icon: <HistoryIcon fontSize="small" /> },
  ];

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #1e2749 0%, #273469 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo & Brand Name */}
          <Box 
            component={Link} 
            to="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              textDecoration: 'none',
              color: 'white'
            }}
          >
            <Box 
              sx={{ 
                width: 38, 
                height: 38, 
                borderRadius: 2, 
                bgcolor: '#4e54c8', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(78,84,200,0.4)'
              }}
            >
              <EventNoteIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 0.5 }}>
              day<span style={{ color: '#8687b4' }}>Planner</span>
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                    bgcolor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: isActive ? 600 : 400,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* Right Section: Date, Pomodoro, Theme & User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title="Focus Pomodoro Timer">
              <IconButton 
                onClick={() => setPomodoroOpen(true)}
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' }
                }}
              >
                <TimerIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton 
                onClick={toggleTheme}
                sx={{ 
                  color: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' }
                }}
              >
                {mode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Chip 
              icon={<CalendarMonth sx={{ color: 'white !important', fontSize: 16 }} />}
              label={currentDateStr}
              size="small"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.12)', 
                color: 'white',
                fontWeight: 500,
                display: { xs: 'none', sm: 'flex' }
              }}
            />

            <Tooltip title="Account settings">
              <IconButton onClick={handleOpenMenu} sx={{ p: 0.5 }}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#4e54c8', 
                    width: 38, 
                    height: 38, 
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              PaperProps={{
                elevation: 4,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 3,
                  bgcolor: '#ffffff',
                  '& .MuiMenuItem-root': { py: 1.2, px: 2 }
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <MenuItem onClick={() => { handleCloseMenu(); navigate('/'); }}>
                <DashboardIcon fontSize="small" sx={{ mr: 1.5, color: '#273469' }} />
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => { handleCloseMenu(); navigate('/planner'); }}>
                <EventNoteIcon fontSize="small" sx={{ mr: 1.5, color: '#273469' }} />
                Day Planner
              </MenuItem>
              <MenuItem onClick={() => { handleCloseMenu(); navigate('/summary'); }}>
                <RateReviewIcon fontSize="small" sx={{ mr: 1.5, color: '#273469' }} />
                Day Summary
              </MenuItem>
              <MenuItem onClick={() => { handleCloseMenu(); navigate('/history'); }}>
                <HistoryIcon fontSize="small" sx={{ mr: 1.5, color: '#273469' }} />
                History
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <PomodoroTimer open={pomodoroOpen} onClose={() => setPomodoroOpen(false)} />
    </AppBar>
  );
};

export default Navbar;
