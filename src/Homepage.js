import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import backgroundImage from './images/BG.jpg'; // Adjust the path if necessary

const Homepage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (role) => {
    setAnchorEl(null);
    if (role) {
      navigate('/login', { state: { role } });
    }
  };
  
  const handleMenuAdmin = (role) => {
    setAnchorEl(null);
    if (role) {
      navigate('/AdminDashboard', { state: { role } });
    }
  };

  const handleLMSClick = () => {
    window.location.reload();
  };

  const handleLoginClick = () => {
    navigate('/login');
  };
  const handleRegisterClick = () => {
    navigate('/register');
  };

  

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Overlay Box */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
      />
      <AppBar>
        <Toolbar style={{ backgroundColor: '87CEFA', minHeight: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <div
              onClick={handleLMSClick}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
                Library Management System
              </Typography>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              color="inherit"
              style={{ marginLeft: 10 }}
            >
              <AccountCircle />
            </IconButton>
            <Button
              color="inherit"
              style={{ marginLeft: 10 }}
              onClick={handleMenuOpen} // Open menu on button click
            >
              Login
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleMenuClose()}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => handleMenuClose('student')}>Student</MenuItem>
              <MenuItem onClick={() => handleMenuClose('librarian')}>Librarian</MenuItem>
              <MenuItem onClick={() => handleMenuAdmin('admin')}>Admin</MenuItem>

            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          p: 2,
        }}
      >
        {/* Add your main content here if needed */}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          p: 4,
          mt: 'auto',
        }}
      >
        <Typography variant="h2" component="div">
          Library Management System
        </Typography>
        <Typography variant="h5" component="div">
          Library Management System project website used to maintain all activities of library system.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button variant="contained" color="error" size="large" onClick={handleRegisterClick}>
            Register
          </Button>
          <Button variant="contained" color="primary" size="large" onClick={handleLoginClick}>
            Login
          </Button>
          
        </Box>
      </Box>
    </Box>
  );
}

export default Homepage;
