import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  Avatar,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  SmartToy as BotIcon,
  Person as PersonIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SendIcon from './icons/SendIcon';

const Message = ({ content, isUser, animate }) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          px: { xs: 2, md: 3 },
        }}
      >
        <Avatar
          sx={{
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            width: 36,
            height: 36,
          }}
        >
          {isUser ? <PersonIcon /> : <BotIcon />}
        </Avatar>
        <Box sx={{ maxWidth: '85%' }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: isUser ? 'primary.main' : theme.palette.mode === 'dark' ? 'background.paper' : '#F8FAFC',
              color: isUser ? '#fff' : theme.palette.mode === 'dark' ? '#94A3B8' : '#000000',
              borderRadius: 2,
              position: 'relative',
              '&:hover .copy-button': {
                opacity: 1,
              },
            }}
          >
            {!isUser && (
              <Tooltip 
                title={copied ? "Copied!" : "Copy to clipboard"} 
                placement="top"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <IconButton
                  onClick={handleCopy}
                  size="small"
                  className="copy-button"
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    color: 'text.secondary',
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {isUser ? (
              <Typography>{content}</Typography>
            ) : (
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            )}
          </Paper>
        </Box>
      </Box>
    </motion.div>
  );
};

const ChatInterface = ({ messages: initialMessages = [], onUpdateMessages }) => {
  const [messages, setMessages] = useState(() => {
    // Try to get messages from localStorage first
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : initialMessages;
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const theme = useTheme();

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Update local messages when initialMessages changes
  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { content: userMessage, isUser: true }];
    setMessages(newMessages);
    onUpdateMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        const updatedMessages = [...newMessages, { content: data.response, isUser: false }];
        setMessages(updatedMessages);
        onUpdateMessages(updatedMessages);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessages = [...newMessages, {
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
      }];
      setMessages(errorMessages);
      onUpdateMessages(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: 'calc(100vh - 140px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          overflowY: 'auto',
          bgcolor: 'background.default',
          borderRadius: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.mode === 'dark' ? '#334155' : '#CBD5E1',
            borderRadius: '4px',
          },
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              textAlign: 'center',
              px: 2,
            }}
          >
            <Typography variant="h6">
              👋 Hi! I'm your AI assistant. How can I help you today?
            </Typography>
          </Box>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <Message key={index} {...message} animate />
            ))}
          </AnimatePresence>
        )}
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: { xs: 2, md: 3 },
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'secondary.main',
                width: 36,
                height: 36,
              }}
            >
              <BotIcon />
            </Avatar>
            <CircularProgress size={24} color="secondary" />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      <Box
        component={motion.div}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        sx={{
          p: 1.5,
          borderTop: '1px solid',
          borderColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(0, 0, 0, 0.03)',
          bgcolor: theme.palette.mode === 'dark'
            ? 'rgba(23, 23, 23, 0.95)'
            : 'rgba(252, 253, 254, 0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 -1px 0 rgba(255, 255, 255, 0.02)'
            : '0 -1px 0 rgba(0, 0, 0, 0.02)',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'flex-end',
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message..."
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(0, 0, 0, 0.01)',
                '& fieldset': {
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.03)',
                },
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)',
                },
                '&.Mui-focused': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.04)'
                    : 'rgba(0, 0, 0, 0.03)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& .MuiInputBase-input': {
                fontSize: '0.8125rem',
                padding: '6px 10px',
              },
            }}
          />
          <Tooltip 
            title="Send message" 
            placement="top"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
          >
            <IconButton
              type="submit"
              onClick={handleSubmit}
              disabled={!input.trim()}
              sx={{
                color: input.trim() ? 'transparent' : theme.palette.text.disabled,
                width: 44,
                height: 44,
                marginBottom: '8px',
                padding: '8px',
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(0, 0, 0, 0.01)',
                border: `1px solid ${theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.03)'
                  : 'rgba(0, 0, 0, 0.03)'}`,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.02)',
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)',
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s',
                },
                '& svg': {
                  strokeWidth: input.trim() ? 2.5 : 1.5,
                  transition: 'stroke-width 0.2s ease',
                },
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.01)'
                    : 'rgba(0, 0, 0, 0.005)',
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(0, 0, 0, 0.02)',
                  color: theme.palette.text.disabled,
                },
              }}
            >
              <SendIcon size={24} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatInterface; 