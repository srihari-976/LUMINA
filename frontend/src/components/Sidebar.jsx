import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  useTheme,
  Tooltip,
  Fade,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { HideSidebarIcon } from './icons/SidebarToggleIcons';

const Sidebar = ({ 
  open, 
  onClose, 
  chats, 
  activeChat, 
  onNewChat, 
  onSelectChat,
  onDeleteChat,
  drawerWidth = 280 
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(180deg, rgba(124, 58, 237, 0.15), rgba(236, 72, 153, 0.15))'
            : 'linear-gradient(180deg, rgba(124, 58, 237, 0.08), rgba(236, 72, 153, 0.08))',
          backdropFilter: 'blur(12px)',
          borderRight: 'none',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '1px',
            background: `linear-gradient(to bottom, 
              ${theme.palette.primary.main}40, 
              ${theme.palette.secondary.main}40
            )`,
          },
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '1px',
          background: `linear-gradient(to right, 
            ${theme.palette.primary.main}40, 
            ${theme.palette.secondary.main}40
          )`,
        },
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Chat History
        </Typography>
        <Tooltip 
          title="Hide sidebar" 
          placement="right"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
        >
          <IconButton 
            onClick={onClose}
            sx={{
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
            <HideSidebarIcon color={theme.palette.text.secondary} />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ p: 1 }}>
        <Tooltip 
          title="New Chat" 
          placement="right"
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
        >
          <ListItemButton
            onClick={onNewChat}
            sx={{
              borderRadius: 2,
              mb: 1,
              background: `linear-gradient(135deg, 
                ${theme.palette.primary.main}20, 
                ${theme.palette.secondary.main}20
              )`,
              '&:hover': {
                background: `linear-gradient(135deg, 
                  ${theme.palette.primary.main}30, 
                  ${theme.palette.secondary.main}30
                )`,
              },
            }}
          >
            <ListItemIcon>
              <AddIcon sx={{ color: theme.palette.primary.main }} />
            </ListItemIcon>
            <ListItemText 
              primary="New Chat"
              primaryTypographyProps={{ 
                fontWeight: 500,
                color: theme.palette.primary.main,
              }}
            />
          </ListItemButton>
        </Tooltip>
      </Box>

      <Box sx={{ px: 1.5, mb: 1.5 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              backgroundColor: 'transparent',
              transition: 'all 0.2s',
              height: '36px',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '&:hover': {
                backgroundColor: 'transparent',
              },
              '&.Mui-focused': {
                backgroundColor: 'transparent',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              },
            },
            '& .MuiInputBase-input': {
              padding: '4px 8px',
              fontSize: '0.8125rem',
              color: searchQuery 
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            },
            '& .MuiInputAdornment-root': {
              marginRight: 0,
              '& .MuiSvgIcon-root': {
                fontSize: '1.125rem',
                color: searchQuery 
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
                transition: 'color 0.2s',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ ml: 1 }}>
                <SearchIcon 
                  sx={{ 
                    color: searchQuery 
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                    transition: 'color 0.2s',
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end" sx={{ mr: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery('')}
                  sx={{
                    color: theme.palette.primary.main,
                    padding: '4px',
                    '&:hover': {
                      color: theme.palette.secondary.main,
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider sx={{ 
        my: 1,
        borderColor: theme.palette.mode === 'dark' 
          ? 'rgba(124, 58, 237, 0.2)' 
          : 'rgba(124, 58, 237, 0.1)',
      }} />

      <List sx={{ flex: 1, overflow: 'auto', px: 1 }}>
        {filteredChats.map((chat) => (
          <ListItem
            key={chat.id}
            disablePadding
            secondaryAction={
              <Tooltip 
                title="Delete chat" 
                placement="right"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  sx={{
                    opacity: 0,
                    transition: 'all 0.2s',
                    color: theme.palette.error.main,
                    '&:hover': {
                      opacity: 1,
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemButton
              selected={activeChat?.id === chat.id}
              onClick={() => onSelectChat(chat)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: 'all 0.2s',
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, 
                    ${theme.palette.primary.main}20, 
                    ${theme.palette.secondary.main}20
                  )`,
                  '&:hover': {
                    background: `linear-gradient(135deg, 
                      ${theme.palette.primary.main}30, 
                      ${theme.palette.secondary.main}30
                    )`,
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiListItemText-primary': {
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                  },
                },
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(124, 58, 237, 0.1)' 
                    : 'rgba(124, 58, 237, 0.05)',
                },
              }}
            >
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText
                primary={chat.title || 'New Chat'}
                secondary={new Date(chat.timestamp).toLocaleDateString()}
                primaryTypographyProps={{
                  noWrap: true,
                  style: { maxWidth: '150px' }
                }}
                secondaryTypographyProps={{
                  noWrap: true,
                  style: { maxWidth: '150px' }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 