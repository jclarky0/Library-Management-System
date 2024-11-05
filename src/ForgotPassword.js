import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Paper } from '@mui/material';
import { requestPasswordReset } from './apiService'; // Import the requestPasswordReset function
import backgroundImage from './images/BG.jpg'; // Adjust the path if necessary

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestReset = async () => {
    try {
      await requestPasswordReset(email);
      setMessage('Password reset email sent');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setMessage('Error requesting password reset');
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
          Forgot Password
        </Typography>
        <Typography variant="body2" gutterBottom textAlign="center">
          Enter your email address to reset your password.
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRequestReset}
        >
          Reset Password
        </Button>
        {message && (
          <Typography variant="body2" align="center" marginTop={2} color="error">
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
