import React, { useState } from 'react';
import {
  Backdrop,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/api';

const BackdropForm = ({ open, onClose, onSuccess }) => {
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const [resume, setResume] = useState(null);

  // NEW: dateApplied from user input
  const [dateApplied, setDateApplied] = useState('');

  // For multiple recruiters
  const [recruiters, setRecruiters] = useState([]);
  // For multiple alumni
  const [alumni, setAlumni] = useState([]);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleAddRecruiter = () => {
    setRecruiters([...recruiters, { name: '', email: '', phone: '' }]);
  };

  const handleRecruiterChange = (index, field, value) => {
    const updated = [...recruiters];
    updated[index][field] = value;
    setRecruiters(updated);
  };

  const handleAddAlumni = () => {
    setAlumni([...alumni, { name: '', email: '', link: '' }]);
  };

  const handleAlumniChange = (index, field, value) => {
    const updated = [...alumni];
    updated[index][field] = value;
    setAlumni(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('companyName', companyName);
      formData.append('position', position);
      formData.append('location', location);
      formData.append('status', status);
      formData.append('notes', notes);
      if (resume) {
        formData.append('resume', resume);
      }

      // Add the dateApplied field
      formData.append('dateApplied', dateApplied);

      // recruiters & alumni
      formData.append('recruiters', JSON.stringify(recruiters));
      formData.append('alumni', JSON.stringify(alumni));

      await api.post('/api/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      alert('Error creating application');
    }
  };

  return (
    <Backdrop open={open} sx={{ zIndex: 9999, overflowY: 'scroll' }}>
      <Paper sx={{ p: 3, width: '90%', maxWidth: 600, position: 'relative' }}>
        <IconButton
          sx={{ position: 'absolute', right: 8, top: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add New Application
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Company Name"
            margin="normal"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Position"
            margin="normal"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <TextField
            fullWidth
            label="Location"
            margin="normal"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <TextField
            fullWidth
            label="Status"
            margin="normal"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          {/* New Field: Date Applied */}
          <TextField
            fullWidth
            type="date"
            label="Date Applied"
            margin="normal"
            value={dateApplied}
            onChange={(e) => setDateApplied(e.target.value)}
            InputLabelProps={{
              shrink: true // ensures label doesn't overlap the default date text
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={2}
            label="Notes"
            margin="normal"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" component="label">
              Upload Resume
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
          </Box>

          {/* Recruiters Section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Recruiters:</Typography>
            {recruiters.map((rec, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                  label="Name"
                  value={rec.name}
                  onChange={(e) => handleRecruiterChange(i, 'name', e.target.value)}
                />
                <TextField
                  label="Email"
                  value={rec.email}
                  onChange={(e) => handleRecruiterChange(i, 'email', e.target.value)}
                />
                <TextField
                  label="Phone"
                  value={rec.phone}
                  onChange={(e) => handleRecruiterChange(i, 'phone', e.target.value)}
                />
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={handleAddRecruiter}
              sx={{ mt: 1 }}
            >
              Add Recruiter
            </Button>
          </Box>

          {/* Alumni Section */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Alumni:</Typography>
            {alumni.map((al, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <TextField
                  label="Name"
                  value={al.name}
                  onChange={(e) => handleAlumniChange(i, 'name', e.target.value)}
                />
                <TextField
                  label="Email"
                  value={al.email}
                  onChange={(e) => handleAlumniChange(i, 'email', e.target.value)}
                />
                <TextField
                  label="Link"
                  value={al.link}
                  onChange={(e) => handleAlumniChange(i, 'link', e.target.value)}
                />
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={handleAddAlumni}
              sx={{ mt: 1 }}
            >
              Add Alumni
            </Button>
          </Box>

          <Button variant="contained" type="submit" sx={{ mt: 3, width: '100%' }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default BackdropForm;
