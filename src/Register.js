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
  const [touched, setTouched] = useState(false); // Track if the user interacted with the form

  // Validation function
  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async (role) => {
    setTouched(true); // Mark form as touched when user attempts to register
    if (!validateForm()) {
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
    setTouched(false); // Reset touched state
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
          width: '400px',
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
          REGISTER
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
          error={touched && !username}
          helperText={touched && !username ? 'Username is required' : ''}
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
          error={touched && (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))}
          helperText={
            touched && !email
              ? 'Email is required'
              : touched && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
              ? 'Invalid email format'
              : ''
          }
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
          error={touched && password.length < 6}
          helperText={touched && password.length < 6 ? 'Password must be at least 6 characters' : ''}
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
          error={touched && password !== confirmPassword}
          helperText={touched && password !== confirmPassword ? 'Passwords do not match' : ''}
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
