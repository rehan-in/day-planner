// src/components/PomodoroTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  RestartAlt,
  Close,
  Timer,
  FreeBreakfast,
  Psychology,
  VolumeUp
} from '@mui/icons-material';

const PRESETS = {
  FOCUS: { name: 'Focus', minutes: 25, color: '#4e54c8' },
  SHORT_BREAK: { name: 'Short Break', minutes: 5, color: '#2e7d32' },
  LONG_BREAK: { name: 'Long Break', minutes: 15, color: '#ed6c02' },
};

const PomodoroTimer = ({ open, onClose, initialTaskName = '' }) => {
  const [mode, setMode] = useState('FOCUS');
  const [timeLeft, setTimeLeft] = useState(PRESETS.FOCUS.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [taskName, setTaskName] = useState(initialTaskName);

  useEffect(() => {
    if (initialTaskName) {
      setTaskName(initialTaskName);
    }
  }, [initialTaskName]);

  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playAlarmSound();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(PRESETS[newMode].minutes * 60);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(PRESETS[mode].minutes * 60);
  };

  const playAlarmSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.5);
      osc.stop(audioCtx.currentTime + 1.5);
    } catch (e) {
      console.log('Audio playback error', e);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const totalSeconds = PRESETS[mode].minutes * 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Timer sx={{ color: PRESETS[mode].color }} />
          <Typography variant="h6" fontWeight="bold">
            Pomodoro Focus Timer
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent textAlign="center">
        {taskName && (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              CURRENT FOCUS TOPIC:
            </Typography>
            <Typography variant="subtitle2" fontWeight="bold" color="primary" noWrap>
              🎯 {taskName}
            </Typography>
          </Box>
        )}

        {/* Mode Selector Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
          {Object.keys(PRESETS).map((presetKey) => (
            <Chip
              key={presetKey}
              label={PRESETS[presetKey].name}
              onClick={() => handleModeChange(presetKey)}
              variant={mode === presetKey ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 600,
                bgcolor: mode === presetKey ? PRESETS[presetKey].color : 'transparent',
                color: mode === presetKey ? '#fff' : 'text.primary',
                borderColor: PRESETS[presetKey].color,
                '&:hover': {
                  bgcolor: PRESETS[presetKey].color,
                  color: '#fff',
                }
              }}
            />
          ))}
        </Box>

        {/* Timer Counter */}
        <Box sx={{ py: 3, textAlign: 'center' }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              fontFamily: 'monospace',
              letterSpacing: 2,
              color: PRESETS[mode].color
            }}
          >
            {formattedTime}
          </Typography>

          <Box sx={{ mt: 2, px: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'action.hover',
                '& .MuiLinearProgress-bar': {
                  bgcolor: PRESETS[mode].color,
                }
              }}
            />
          </Box>
        </Box>

        {/* Control Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 1 }}>
          <Button
            variant="contained"
            size="large"
            onClick={toggleTimer}
            startIcon={isActive ? <Pause /> : <PlayArrow />}
            sx={{
              bgcolor: PRESETS[mode].color,
              px: 4,
              py: 1.2,
              borderRadius: 3,
              fontWeight: 600,
              '&:hover': { opacity: 0.9 }
            }}
          >
            {isActive ? 'Pause' : 'Start'}
          </Button>

          <Tooltip title="Reset Timer">
            <IconButton onClick={resetTimer} color="default" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <RestartAlt />
            </IconButton>
          </Tooltip>

          <Tooltip title="Test Sound Alert">
            <IconButton onClick={playAlarmSound} color="default" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <VolumeUp />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Stay focused for 25 minutes, then take a 5-minute break.
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default PomodoroTimer;
