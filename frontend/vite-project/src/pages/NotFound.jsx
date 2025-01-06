import React from 'react';
import { Box, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" color="error">
        404 - Not Found
      </Typography>
    </Box>
  );
};

export default NotFound;
