import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, AppBar, Toolbar, IconButton, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, CssBaseline } from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RestoreIcon from '@mui/icons-material/Restore';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import axios from 'axios';
 
const drawerWidth = 240;
 
const ReturnBooks = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [requests, setRequests] = useState([]);
  const location = useLocation();

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
 
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
 
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };
 
  const handlePersonalInfoClick = () => {
    navigate('/LibrarianPersonalInfo'); // Navigate to PersonalInfo page
  };
 
  useEffect(() => {
    const fetchReturnedBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/book-requests/returned');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching returned books:', error);
      }
    };
 
    fetchReturnedBooks();
  }, []);
 
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Library Management System
          </Typography>
          <Typography variant="body1" component="div" sx={{ marginRight: 2 }}>
            {username}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handlePersonalInfoClick}>Personal Information</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem button component={Link} to="/LibrarianDashboard">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/AddBookList">
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Books" />
          </ListItem>
          <ListItem button component={Link} to="/RestrictedAccount">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Restricted Student" />
          </ListItem>
          <ListItem button component={Link} to="/ReservationBooks">
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary="Reservation Books" />
          </ListItem>
          <ListItem button component={Link} to="/ReturnBooks">
            <ListItemIcon>
              <RestoreIcon />
            </ListItemIcon>
            <ListItemText primary="Return Books" />
          </ListItem>
          <ListItem button component={Link} to="/IssueBooks">
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Issue Books" />
          </ListItem>
          <ListItem button component={Link} to="/RequestedBooks">
            <ListItemIcon>
            <RequestPageIcon />
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
        <Box sx={{ width: '100%', paddingTop: 8 }}>
          <Typography
            variant="h4"
            component="div"
            sx={{
              marginBottom: 4,
              textAlign: 'left', // Align to the left
              paddingTop: 0,
              paddingBottom: 2,
            }}
          >
            Returned Books
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="returned books table">
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Borrow Date</TableCell>
                  <TableCell>Return Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.user.username}</TableCell>
                    <TableCell>{request.bookTitle}</TableCell>
                    <TableCell>{request.borrowDate ? new Date(request.borrowDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{request.returnDate ? new Date(request.returnDate).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>{request.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};
 
export default ReturnBooks;