import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../services/api';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, username, email, password } = form;
    if (!firstName || !lastName || !username || !email || !password) {
      setError('Please fill in all required fields.');
      return false;
    }
    // Simple email regex for validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return false;
    }
    setError('');
    return true;
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/users/register', form, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (response.status === 201) {
        setSuccess('Registration successful! You can now log in.');
        setForm({
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          password: '',
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          (err.response?.data?.errors
            ? err.response.data.errors.map((e) => e.msg).join(', ')
            : 'Registration failed. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', padding: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Register
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              margin="normal"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              margin="normal"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              value={form.username}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              name="password"
              margin="normal"
              value={form.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              variant="contained"
              type="submit"
              sx={{ mt: 3, width: '100%' }}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
