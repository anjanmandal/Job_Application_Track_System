// src/components/Footer.js
import React from 'react';
import { Box, Typography, Link, IconButton, Grid, Divider } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 5,
        py: 1,
        width: '100%',
        bgcolor: 'background.paper',
        boxShadow: '0px -2px 5px rgba(0,0,0,0.1)',
      }}
    >
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Job Tracker. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
