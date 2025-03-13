import React from 'react';

export const HideSidebarIcon = ({ color = 'cyan' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="12" r="3" fill={color}/>
    <circle cx="6" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <path d="M6 12H18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M15 9L18 12L15 15" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ShowSidebarIcon = ({ color = 'magenta' }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="12" r="3" fill={color}/>
    <circle cx="18" cy="12" r="3" stroke={color} strokeWidth="2"/>
    <path d="M6 12H18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M9 9L6 12L9 15" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
); 