import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to import axios
import backgroundImage from './images/BG.jpg'; // Adjust the path if necessary

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Username/Email & Password MUST BE PROVIDED');
      return;
    }

    const userData = { username, password };
    try {
      const response = await axios.post('http://localhost:8080/users/login', userData);
      const { role } = response.data;

      console.log('User logged in:', response);

      localStorage.setItem('username', username); // Set username in localStorage

      if (role === 2) {
        navigate('/LibrarianDashboard', { state: { username } });
      } else {
        navigate('/studdashboard', { state: { username } });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response && error.response.status === 403) {
        setError(error.response.data);
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 2,
          width: '300px',
          height: '350px',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          textAlign="center"
          sx={{ fontWeight: 'bold', marginTop: '20px' }}
        >
          LOGIN
        </Typography>
        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          label="Username or Email"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Sign in
        </Button>
        <Typography variant="body2" align="center" marginTop={2}>
          Don't have an account? <Link href="/register">Register Now</Link>
        </Typography>
        <Typography variant="body2" align="center" marginTop={2}>
          <Link href="/forgot-password">Forgot Password?</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
