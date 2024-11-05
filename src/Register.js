import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Link, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './apiService'; // Import the registerUser function
import backgroundImage from './images/BG.jpg'; // Adjust the path if necessary

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (role) => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const userData = { username, email, password, role, enabled: role === 2 ? false : true }; // Set enabled to false for librarian
    try {
      const response = await registerUser(userData);
      console.log('User registered:', response);
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate('/login');
        resetForm(); // Reset the form after successful registration
      }, 2000); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Error registering user:', error);
      setError('Registration failed. Please try again.');
    }
  };

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
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
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Typography
          variant="h4"
          component="div"
          gutterBottom
          textAlign="center"
          sx={{ fontWeight: 'bold', marginTop: '15px' }}
        >
          Register
        </Typography>
        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError('');
          }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError('');
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => handleRegister(1)} // ROLE_USER for students
        >
          Register as Student
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => handleRegister(2)} // ROLE_LIBRARIAN for librarians
        >
          Register as Librarian
        </Button>
        <Typography variant="body2" align="center" marginTop={2}>
          Already have an account? <Link href="/login">Login Now</Link>
        </Typography>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
            You successfully registered!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Register;
