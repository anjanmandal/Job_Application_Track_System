import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';

const ApplicationList = ({ applications, onUpdate }) => {
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/applications/${id}`, {
          withCredentials: true
        });
        onUpdate();
      } catch (err) {
        console.error(err);
        alert('Delete failed');
      }
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {applications.map((app) => (
        <Card key={app._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{app.companyName}</Typography>
            <Typography>Position: {app.position}</Typography>
            <Typography>Location: {app.location}</Typography>
            <Typography>Status: {app.status}</Typography>
            <Typography>Date Applied: {new Date(app.dateApplied).toLocaleDateString()}</Typography>
            <Typography>Notes: {app.notes}</Typography>
            {app.resumePath && (
              <Typography>
                Resume: <a href={`${process.env.REACT_APP_API_URL}/${app.resumePath}`} target="_blank" rel="noreferrer">View</a>
              </Typography>
            )}
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 1 }}
              onClick={() => handleDelete(app._id)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ApplicationList;
