import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  Menu,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
} from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook'; // Book Icon
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RestoreIcon from '@mui/icons-material/Restore';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import axios from 'axios';

const drawerWidth = 240;

const LibrarianDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [showBooks, setShowBooks] = useState(false); // Default to showing books
  const [showUsers, setShowUsers] = useState(false); // Default to hiding users
  const username = location.state?.username || localStorage.getItem('username');

  // Fetch books and users from the backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/users');
        setUsers(response.data.filter((user) => user.role === 1));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchBooks();
    fetchUsers();
  }, []);

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

  const handleEditBook = (book) => {
    navigate('/AddBookList', { state: { book } });
  };

  const toggleShowBooks = () => {
    setShowBooks(true);
    setShowUsers(false);
  };

  const toggleShowUsers = () => {
    setShowUsers(true);
    setShowBooks(false);
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
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem button component={Link} to="/librariandashboard">
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
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <Grid container spacing={2}>
          {/* Books Section */}
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={toggleShowBooks}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'center',
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  marginBottom: '8px',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                }}
              >
                <MenuBookIcon sx={{ fontSize: 24, color: '#4CAF50' }} />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  BOOKS
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', marginTop: '2px' }}>
                  ({books.length})
                </Typography>
              </Box>
            </Button>
          </Grid>

          {/* Users Section */}
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              onClick={toggleShowUsers}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'center',
                padding: '10px 15px',
                backgroundColor: '#FF7043',
                width: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  marginBottom: '8px',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                }}
              >
                <PersonIcon sx={{ fontSize: 24, color: '#FF7043' }} />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ color: '#fff' }}>
                  REGISTERED STUDENTS
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff', marginTop: '2px' }}>
                  ({users.length})
                </Typography>
              </Box>
            </Button>
          </Grid>
        </Grid>

        {/* Books or Users Content */}
        {showBooks && (
          <Grid container spacing={2} sx={{ marginTop: 3 }}>
            {books.map((book) => (
        <Grid item xs={12} sm={6} md={4} key={book.id}>
         <Card
          sx={{
          maxWidth: 250,
          maxHeight: 400,
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s',
          '&:hover': {
          transform: 'scale(1.05)',
           },
          }}
          >
        <CardMedia
          component="img"
          height="140"
          image={book.photo ? `data:image/jpeg;base64,${book.photo}` : 'placeholder-image-url'}
          sx={{ objectFit: 'fill' }}
          />
         <CardContent>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 'bold', fontSize: '1rem' }}
            >
            {book.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            ISBN: {book.isbn}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Author: {book.author}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Category: {book.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Quantity: {book.quantity}
            </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleEditBook(book)}
                sx={{ marginTop: '10px' }}
                >
                View
              </Button>
            </CardContent>
          </Card>
        </Grid>
        ))}
          </Grid>
        )}

        {showUsers && (
          <Grid container spacing={2} sx={{ marginTop: 3 }}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <Card sx={{ maxWidth: 250 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: 'black' }}>
                      {user.username}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.email}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default LibrarianDashboard;
