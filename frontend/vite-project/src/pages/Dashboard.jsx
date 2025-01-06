import React from 'react';
import { Typography, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Box>
      <Typography variant="h4">Dashboard</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This is a protected route. You are logged in if you can see this.
      </Typography>
    </Box>
  );
};

export default Dashboard;
