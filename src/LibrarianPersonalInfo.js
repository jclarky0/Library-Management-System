import React, { useState, useEffect } from 'react';
import { Typography, Box, AppBar, Toolbar, IconButton, Button, Avatar, Paper, Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// UserInfo component for fetching and displaying user details
const UserInfo = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/${user}`);
      setUserInfo(response.data);
    } catch (error) {
      if (error.response) {
        // Server responded with an error
        if (error.response.status === 404) {
          setError('User not found');
        } else if (error.response.status === 401) {
          setError('Unauthorized access');
        } else {
          setError('An error occurred while fetching user data');
        }
      } else if (error.request) {
        // No response from the server
        setError('No response from the server');
      } else {
        // Other errors
        setError('An error occurred');
      }
    }
  };

  useEffect(() => {
    if (user) fetchUserInfo();
  }, [user]);

  if (error) {
    return <Typography variant="body1" sx={{ color: 'red', fontSize: '0.875rem' }}>{error}</Typography>;
  }

  if (!userInfo) {
    return <Typography variant="body1" sx={{ fontSize: '0.875rem' }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '0.875rem'}}>
        <strong>Username:</strong> {userInfo.username}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '0.875rem' }}>
        <strong>Email:</strong> {userInfo.email}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '0.875rem' }}>
        <strong>Password:</strong> 
        <Button size="small" sx={{ marginLeft: 1, fontSize: '0.7rem' }}>Change Password</Button>
      </Typography>
    </Box>
  );
};

const LibrarianPersonalInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  // Use username from state or localStorage
  const username = location.state?.username || localStorage.getItem('username');

  // Menu handler functions
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleChangePasswordClick = () => {
    navigate('/LibChangePassword');
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
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
            Library Management System
          </Typography>
          <Typography variant="body1" component="div" sx={{ color: 'white', marginRight: 2 }}>
            {username}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleMenuClose}>Personal Information</MenuItem>
            <MenuItem onClick={() => navigate('/borrowlist')}>Borrowed Book</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Paper elevation={3} sx={{ padding: 4, marginTop: 4, maxWidth: 300, height: 380, width: '100%', textAlign: 'center' }}>
        <Typography variant="h5" sx={{ marginTop: 2, marginBottom: 2, fontWeight: 'bold' }}>
          Personal Information
        </Typography>
        <Avatar alt={username} src="/static/images/avatar/1.jpg" sx={{ width: 80, height: 80, margin: 'auto', marginBottom: 4 }} />
        <UserInfo user={username} />
        <Button variant="contained" color="primary" onClick={handleBackClick} sx={{ marginTop: 5 }}>
          Back
        </Button>
      </Paper>
    </Box>
  );
};

export default LibrarianPersonalInfo;
