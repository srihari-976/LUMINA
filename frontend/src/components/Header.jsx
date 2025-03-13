import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

const Header = ({ darkMode, setDarkMode, children }) => {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: theme.palette.mode === 'dark' 
          ? 'rgba(15, 23, 42, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {children}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="View on GitHub">
            <IconButton
              color="inherit"
              onClick={() => window.open('https://github.com/srihari-976/LUMINA', '_blank')}
              sx={{ 
                color: theme.palette.text.primary,
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s',
                },
              }}
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{ 
                color: theme.palette.text.primary,
                '&:hover': {
                  transform: 'scale(1.1)',
                  transition: 'transform 0.2s',
                },
              }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
