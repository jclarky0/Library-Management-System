import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Divider, Menu, MenuItem,
  IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RestoreIcon from '@mui/icons-material/Restore';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';

const drawerWidth = 240;

const RestrictedAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.username || 'Librarian';
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [restrictedAccounts, setRestrictedAccounts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/users')  // Fetch all users
      .then(response => {
        setRestrictedAccounts(response.data);
      })
      .catch(error => {
        console.error('Error fetching restricted accounts:', error);
      });
  }, []);

  const username = location.state?.username || localStorage.getItem('username');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/users${username}`);
        const { username, email } = response.data;

      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    if (username && username !== 'Guest') {
      fetchUserInfo();
    }
  }, [username]);


  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const handlePersonalInfo = () => {
    navigate('/LibrarianPersonalInfo');
    handleClose();
  };

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleRestrict = (user) => {
    setSelectedUser(user);
    setDialogContent('Request restriction for this user?');
    setDialogOpen(true);
  };

  const handleUnrestrict = (user) => {
    setSelectedUser(user);
    setDialogContent('Request to unrestrict this user?');
    setDialogOpen(true);
  };

  const handleDialogClose = (confirmed) => {
    setDialogOpen(false);
    if (confirmed) {
      if (dialogContent.includes('restriction')) {
        axios.post(`http://localhost:8080/users/restrict-user/${selectedUser.id}`)
          .then(response => {
            console.log('Restriction request sent:', response.data);
            setRestrictedAccounts(restrictedAccounts.map(account => 
              account.id === selectedUser.id ? { ...account, status: 'PENDING_RESTRICTION' } : account
            ));
          })
          .catch(error => {
            console.error('Error sending restriction request:', error);
          });
      } else {
        axios.post(`http://localhost:8080/users/unrestrict-user/${selectedUser.id}`)
          .then(response => {
            console.log('Unrestriction request sent:', response.data);
            setRestrictedAccounts(restrictedAccounts.map(account => 
              account.id === selectedUser.id ? { ...account, status: 'PENDING_UNRESTRICT' } : account
            ));
          })
          .catch(error => {
            console.error('Error sending unrestriction request:', error);
          });
      }
    }
    setSelectedUser(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar style={{ backgroundColor: '87CEFA' }}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Library Management System
          </Typography>
          <Typography variant="body1" component="div" sx={{ marginRight: 2 }}>
            {username}
          </Typography>
          <div>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handlePersonalInfo}>Personal Information</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 0,
            transition: 'width 0.3s',
            boxSizing: 'border-box',
            overflowX: 'hidden',
          },
          '&:hover .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem button onClick={() => handleMenuClick('/LibrarianDashboard')}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('/AddBookList')}>
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Books" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('/RestrictedAccount')}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Restricted Student" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('/ReservationBooks')}>
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary="Reservation Books" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('/ReturnBooks')}>
            <ListItemIcon>
              <RestoreIcon />
            </ListItemIcon>
            <ListItemText primary="Return Books" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('/IssueBooks')}>
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Issue Books" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('/RequestedBooks')}>
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Requested Books" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          User List Accounts
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restrictedAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.username}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.status}</TableCell>
                  <TableCell>
                    {account.status === 'RESTRICTED' ? (
                      <IconButton color="success" onClick={() => handleUnrestrict(account)}>
                        <CheckIcon />
                      </IconButton>
                    ) : account.status === 'PENDING_RESTRICTION' || account.status === 'PENDING_UNRESTRICT' ? null : (
                      <IconButton color="warning" onClick={() => handleRestrict(account)}>
                        <BlockIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogContent}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {dialogContent.toLowerCase()}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(true)} color="primary" variant="contained">Yes</Button>
          <Button onClick={() => handleDialogClose(false)} color="primary" variant="outlined" autoFocus>No</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestrictedAccount;
