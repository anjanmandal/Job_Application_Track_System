import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';

const ApplicationDetailsDialog = ({ open, onClose, application }) => {
  if (!application) return null;

  const handleResumePreview = () => {
    // You can open a new window or create a custom modal for preview
    window.open(`/${application.resumePath}`, '_blank');
  };

  const handleResumeDownload = () => {
    // Force download or open in new tab
    window.open(`/${application.resumePath}?download=true`, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Application Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          <strong>Company:</strong> {application.companyName}
        </Typography>
        <Typography variant="body1">
          <strong>Position:</strong> {application.position}
        </Typography>
        <Typography variant="body1">
          <strong>Location:</strong> {application.location}
        </Typography>
        <Typography variant="body1">
          <strong>Status:</strong> {application.status}
        </Typography>
        <Typography variant="body1">
          <strong>Date Applied:</strong>{' '}
          {application.dateApplied
            ? new Date(application.dateApplied).toLocaleDateString()
            : ''}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Notes:</strong> {application.notes}
        </Typography>

        {application.recruiters && application.recruiters.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Recruiters</Typography>
            {application.recruiters.map((rec) => (
              <Typography key={rec._id}>
                {rec.name} - {rec.email} {rec.phone && `- ${rec.phone}`}
              </Typography>
            ))}
          </Box>
        )}

        {application.alumni && application.alumni.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Alumni</Typography>
            {application.alumni.map((al) => (
              <Typography key={al._id}>
                {al.name} - {al.email} {al.link && `- ${al.link}`}
              </Typography>
            ))}
          </Box>
        )}

        {application.resumePath && (
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleResumePreview} sx={{ mr: 2 }}>
              Preview Resume
            </Button>
            <Button variant="outlined" onClick={handleResumeDownload}>
              Download Resume
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationDetailsDialog;
