import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Container, AppBar, Toolbar, Divider,
  List, ListItem, ListItemIcon, ListItemText, CssBaseline, Drawer, IconButton,
  Menu, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RestoreIcon from '@mui/icons-material/Restore';
import AccountCircle from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

const AddBook = () => {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    isbn: '',
    name: '',
    author: '',
    category: '',
    quantity: '',
    deweyDecimal: ''
  });
  const [photo, setPhoto] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleCategoryChange = (event) => {
    setBook({ ...book, category: event.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('isbn', book.isbn);
    formData.append('name', book.name);
    formData.append('author', book.author);
    formData.append('category', book.category);
    formData.append('quantity', book.quantity);
    formData.append('deweyDecimal', book.deweyDecimal);
    formData.append('photo', photo);
  
    fetch('http://localhost:8080/books', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Book added:', data);
        navigate('/addbooklist'); // Navigate back to the book list
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

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

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar style={{ backgroundColor: '87CEFA' }}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Library Management System
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
          <ListItem button onClick={() => handleMenuClick('/librariandashboard')}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('/AddBook')}>
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Add Book Stock" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('/restricted-student')}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Restricted Student" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('/issue-books')}>
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary="Issue Books" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('/return-books')}>
            <ListItemIcon>
              <RestoreIcon />
            </ListItemIcon>
            <ListItemText primary="Return Books" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: 0 }}
      >
        <Toolbar />
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginLeft: -30, // Adjust this value to move more to the left
              marginRight: 0,
            }}
          >
            <Typography component="h1" variant="h5">
              Add New Book
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="isbn"
                label="Isbn"
                name="isbn"
                autoComplete="isbn"
                autoFocus
                value={book.isbn}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Book Title"
                name="name"
                autoComplete="name"
                value={book.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="author"
                label="Author"
                name="author"
                autoComplete="author"
                value={book.author}
                onChange={handleChange}
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={book.category}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="Nursing">Nursing</MenuItem>
                  <MenuItem value="Civil Engineering">Civil Engineering</MenuItem>
                  <MenuItem value="Electrical Engineering">Electrical Engineering</MenuItem>
                  <MenuItem value="Business Administration">Business Administration</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Others">Others</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                id="quantity"
                label="Quantity"
                name="quantity"
                autoComplete="quantity"
                value={book.quantity}
                onChange={handleChange}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="deweyDecimal"
                label="Dewey Decimal"
                name="deweyDecimal"
                autoComplete="deweyDecimal"
                value={book.deweyDecimal}
                onChange={handleChange}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              />
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AddBook;
