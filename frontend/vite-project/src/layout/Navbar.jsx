// src/layout/Navbar.js
import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Example simple Navbar
const Navbar = ({ open, onToggleDrawer }) => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1 
      }}
    >
      <Toolbar>
        <IconButton 
          color="inherit" 
          aria-label="open drawer" 
          onClick={onToggleDrawer} 
          edge="start" 
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Title */}
        <Typography
          variant="h6"
          noWrap
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          Job Tracker
        </Typography>

        {/* Example of some spacing or other buttons */}
        <Box sx={{ flexGrow: 1 }} />
        {/* You could add more icons or a theme switch here */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
