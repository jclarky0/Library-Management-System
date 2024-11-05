import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Divider, IconButton, Container, Grid, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RestoreIcon from '@mui/icons-material/Restore';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { DataGrid } from '@mui/x-data-grid';

const drawerWidth = 240;

const books = [
  { id: 'IT-321', name: "Junrey's Journey", author: 'Junrey Wagwag', category: 'IT' },
  { id: 'NURS-101', name: "Nursing Fundamentals", author: 'Nurse A. Care', category: 'Nursing' },
  { id: 'CE-200', name: "Building the Future", author: 'Engineer C. Structure', category: 'Civil Engineering' },
  { id: 'EE-300', name: "Electric Dreams", author: 'Engineer E. Circuit', category: 'Electrical Engineering' },
  { id: 'BA-400', name: "Business Basics", author: 'Business B. Leader', category: 'Business Administration' },
  { id: 'OTH-500', name: "Miscellaneous Topics", author: 'Author O. General', category: 'Others' },
  // Add more books as needed...
];

const columns = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'name', headerName: 'Name', width: 300 },
  { field: 'author', headerName: 'Author', width: 300 },
  { field: 'category', headerName: 'Category', width: 200 },
];

const ViewBooks = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

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
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem button onClick={() => handleMenuClick('/LibrarianPersonalInfo')}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleMenuClick('/AddBook')}>
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
          <ListItem button onClick={() => handleMenuClick('/ViewBooks')}>
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="View Books" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Container>
          <Typography variant="h4" gutterBottom>
            View Books
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                IT
              </Typography>
              <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                  rows={books.filter(book => book.category === 'IT')}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Nursing
              </Typography>
              <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                  rows={books.filter(book => book.category === 'Nursing')}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Civil Engineering
              </Typography>
              <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                  rows={books.filter(book => book.category === 'Civil Engineering')}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Electrical Engineering
              </Typography>
              <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                  rows={books.filter(book => book.category === 'Electrical Engineering')}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Business Administration
              </Typography>
              <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                  rows={books.filter(book => book.category === 'Business Administration')}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Others
              </Typography>
              <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                  rows={books.filter(book => book.category === 'Others')}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                />
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default ViewBooks;
