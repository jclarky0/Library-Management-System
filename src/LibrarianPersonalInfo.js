import React, { useState, useEffect } from 'react';
import { Typography, Box, AppBar, Toolbar, IconButton, Button, Avatar, Paper, Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LibrarianPersonalInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState({
    username: 'username',
    email: 'email',
  });
  
  const username = location.state?.username || localStorage.getItem('username');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/users${username}`);
        const { username, email } = response.data;

        setUserInfo({
          username,
          email,
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (username && username !== 'Guest') {
      fetchUserInfo();
    }
  }, [username]);

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
        <Typography variant="h5" component="div" sx={{ marginTop: 2, marginBottom: 2, fontWeight: 'bold' }}>
          Personal Information
        </Typography>
        <Avatar alt={userInfo.username} src="/static/images/avatar/1.jpg" sx={{ width: 80, height: 80, margin: 'auto', marginBottom: 4 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="body1" component="div" sx={{ marginBottom: 1, fontSize: '0.875rem' }}>
            <strong>Username:</strong> {userInfo.username}
          </Typography>
          <Typography variant="body1" component="div" sx={{ marginBottom: 1, fontSize: '0.875rem' }}>
            <strong>Email:</strong> {userInfo.email}
          </Typography>
          <Typography variant="body1" component="div" sx={{ marginBottom: 1, fontSize: '0.875rem' }}>
            <strong>Password:</strong> 
            <Button size="small" sx={{ marginLeft: 1, fontSize: '0.7rem' }} onClick={handleChangePasswordClick}>Change Password</Button>
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={handleBackClick} sx={{ marginTop: 5 }}>
          Back
        </Button>
      </Paper>
    </Box>
  );
};

export default LibrarianPersonalInfo;
