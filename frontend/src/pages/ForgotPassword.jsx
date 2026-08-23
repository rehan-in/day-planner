// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center',
      bgcolor: '#f5f5f5',
      background: 'linear-gradient(135deg, #1e2749 0%, #273469 100%)'
    }}>
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Link to="/login" style={{ color: '#273469', marginRight: 2 }}>
              <ArrowBack />
            </Link>
            <Box>
              <Typography variant="h5" fontWeight="bold" color="#273469">
                Forgot Password
              </Typography>
              <Typography variant="body2" color="textSecondary">
                We'll send you a reset link
              </Typography>
            </Box>
          </Box>

          {sent ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset link has been sent to your email. Please check your inbox.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  bgcolor: '#273469',
                  '&:hover': { bgcolor: '#1e2749' },
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#273469', fontWeight: 'bold' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;