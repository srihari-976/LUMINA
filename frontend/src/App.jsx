import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Container, CssBaseline, useMediaQuery, IconButton, Typography } from '@mui/material';
import { ShowSidebarIcon } from './components/icons/SidebarToggleIcons';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // Load chats from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: [],
      timestamp: Date.now(),
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat);
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleDeleteChat = (chatId) => {
    setChats(chats.filter(chat => chat.id !== chatId));
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }
  };

  const handleUpdateChat = (messages) => {
    if (!activeChat) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          messages,
          title: messages[0]?.content.slice(0, 30) + '...' || 'New Chat',
          timestamp: Date.now(),
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setActiveChat(updatedChats.find(chat => chat.id === activeChat.id));
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#CFD8DC' : '#6D4C41', // text color as primary
        light: darkMode ? '#ECEFF1' : '#8D6E63',
        dark: darkMode ? '#B0BEC5' : '#5D4037',
      },
      secondary: {
        main: darkMode ? '#546E7A' : '#FFAB91', // searchBox color as secondary
        light: darkMode ? '#78909C' : '#FFCCBC',
        dark: darkMode ? '#455A64' : '#FF8A65',
      },
      background: {
        default: darkMode ? '#263238' : '#FFF3E0', // background color
        paper: darkMode ? '#37474F' : '#FFCCBC', // sidebar color
      },
      text: {
        primary: darkMode ? '#CFD8DC' : '#6D4C41', // text color
        secondary: darkMode ? '#90A4AE' : '#8D6E63', // lighter/darker version of text
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(12px)',
            backgroundColor: darkMode 
              ? 'rgba(38, 50, 56, 0.85)' // dark background with transparency
              : 'rgba(255, 243, 224, 0.85)', // light background with transparency
            boxShadow: 'none',
            borderBottom: '1px solid',
            borderColor: darkMode 
              ? 'rgba(207, 216, 220, 0.1)' // dark mode text color with low opacity
              : 'rgba(109, 76, 65, 0.1)', // light mode text color with low opacity
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            boxShadow: 'none',
            backgroundColor: darkMode ? '#37474F' : '#FFCCBC', // sidebar color
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Header darkMode={darkMode} setDarkMode={setDarkMode}>
          {!sidebarOpen && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setSidebarOpen(true)}
              sx={{ 
                mr: 2,
                color: theme.palette.text.secondary,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at center,
                    ${theme.palette.primary.main}80,
                    ${theme.palette.secondary.main}80,
                    transparent 70%
                  )`,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  animation: 'pulse 2s infinite',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: `radial-gradient(circle at center,
                    ${theme.palette.primary.main}60,
                    ${theme.palette.secondary.main}60,
                    transparent 70%
                  )`,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  animation: 'pulse 2s infinite 1s',
                },
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 0.8,
                  },
                  '50%': {
                    transform: 'scale(1.3)',
                    opacity: 0.4,
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 0.8,
                  },
                },
                '&:hover': {
                  color: theme.palette.text.primary,
                  transform: 'translateX(2px)',
                  transition: 'all 0.2s',
                  '&::before, &::after': {
                    opacity: 1,
                  },
                  '& svg': {
                    transform: 'scale(1.1)',
                  },
                },
              }}
            >
              <ShowSidebarIcon color={theme.palette.text.secondary} />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              position: 'relative',
              '&:hover .full-name': {
                opacity: 1,
                transform: 'translateY(0)',
                width: '100%',
              },
              '&:hover .short-name': {
                opacity: 0,
                transform: 'translateY(-100%)',
              },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                height: '1.5em',
                overflow: 'hidden',
                minWidth: '800px',
                maxWidth: '1000px',
              }}
            >
              <Box
                className="short-name"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transition: 'all 0.3s ease',
                  opacity: 1,
                  transform: 'translateY(0)',
                  background: `linear-gradient(135deg, 
                    ${darkMode ? '#CFD8DC' : '#6D4C41'}, 
                    ${darkMode ? '#546E7A' : '#FFAB91'}
                  )`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                LUMINA
              </Box>
              <Box
                className="full-name"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  transition: 'all 0.3s ease',
                  opacity: 0,
                  transform: 'translateY(100%)',
                  whiteSpace: 'nowrap',
                  width: 0,
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, 
                    ${darkMode ? '#CFD8DC' : '#6D4C41'}, 
                    ${darkMode ? '#546E7A' : '#FFAB91'}
                  )`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  animation: 'typing 4s steps(80, end)',
                  '@keyframes typing': {
                    'from': { width: 0 },
                    'to': { width: '100%' },
                  },
                }}
              >
                Language Understanding for Modern Intelligent Neural Answers
              </Box>
            </Box>
          </Typography>
        </Header>
        <Box sx={{ display: 'flex', flex: 1 }}>
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            chats={chats}
            activeChat={activeChat}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
          />
          <Container 
            maxWidth="lg" 
            sx={{ 
              flex: 1, 
              py: 3,
              display: 'flex',
              flexDirection: 'column',
              ml: sidebarOpen ? '280px' : 0,
              transition: 'margin-left 0.3s ease',
            }}
          >
            <ChatInterface
              messages={activeChat?.messages || []}
              onUpdateMessages={handleUpdateChat}
            />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App; 