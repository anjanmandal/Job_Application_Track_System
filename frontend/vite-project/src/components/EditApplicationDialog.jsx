import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box
} from '@mui/material';
import api from '../services/api';

const EditApplicationDialog = ({ open, onClose, application, onSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    companyName: application.companyName || '',
    position: application.position || '',
    location: application.location || '',
    status: application.status || 'Applied',
    dateApplied: application.dateApplied
      ? new Date(application.dateApplied).toISOString().split('T')[0]
      : '', // store as YYYY-MM-DD
    notes: application.notes || ''
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdate = async () => {
    try {
      // We can send only the updated fields. 
      // Since we might also want to update recruiters/alumni, this code can be extended.
      const data = { ...form };
      // Convert dateApplied to string
      data.dateApplied = form.dateApplied ? new Date(form.dateApplied).toISOString() : '';

      await api.put(`/api/applications/${application._id}`, data);
      onSuccess(); // let parent know edit was successful
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const handleClose = () => {
    onClose();
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Application</DialogTitle>
      <DialogContent dividers>
        {/* Modern, professional layout: 
            - If isEditing === false, we show read-only texts
            - If isEditing === true, we show TextFields */}
        
        {!isEditing ? (
          <Box>
            <Typography variant="subtitle1">
              <strong>Company:</strong> {form.companyName}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Position:</strong> {form.position}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Location:</strong> {form.location}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Status:</strong> {form.status}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Date Applied:</strong>{' '}
              {form.dateApplied ? new Date(form.dateApplied).toLocaleDateString() : ''}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Notes:</strong> {form.notes}
            </Typography>
          </Box>
        ) : (
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
          >
            <TextField
              label="Company Name"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Date Applied"
              name="dateApplied"
              type="date"
              value={form.dateApplied}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {/* If not editing, show 'Edit' button; if editing, show 'Cancel' & 'Save' */}
        {!isEditing ? (
          <Button variant="contained" onClick={handleEditToggle}>
            Edit
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={handleEditToggle}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleUpdate}>
              Save
            </Button>
          </>
        )}

        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditApplicationDialog;
