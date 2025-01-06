import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Card, CardContent } from '@mui/material';
import api from '../services/api';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/users/login', form);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              value={form.username}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              margin="normal"
              value={form.password}
              onChange={handleChange}
            />
            <Button variant="contained" type="submit" sx={{ mt: 2, width: '100%' }}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
