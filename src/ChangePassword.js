// ChangePassword.js
import React, { useState } from 'react';
import { Typography, Box, AppBar, Toolbar, IconButton, Button, TextField, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password do not match");
      return;
    }

    // Add logic to change password here
    alert('Password successfully changed');
    navigate(-1); // Go back to the previous page
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
      }}
    >
      <AppBar sx={{ backgroundColor: '#2196f3' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBackClick} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Change Password
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, maxWidth: 300, width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" component="div" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
          Change Password
        </Typography>
        <TextField
          label="Old Password"
          type="password"
          fullWidth
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Paper>
    </Box>
  );
};

export default ChangePassword;
