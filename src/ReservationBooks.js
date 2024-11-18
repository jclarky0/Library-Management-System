import React, { useState, useEffect } from 'react';
import { Box, Container, AppBar, Toolbar, Divider, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Drawer, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useNavigate, useLocation} from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RestoreIcon from '@mui/icons-material/Restore';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
 
const drawerWidth = 240;
 
const ReservationBooks = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tableAnchorEl, setTableAnchorEl] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [open, setOpen] = useState(false);
  const [borrowDate, setBorrowDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [denyDialogOpen, setDenyDialogOpen] = useState(false); // State for deny confirmation dialog
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
 
  const handleTableMenuClick = (event, bookId) => {
    setSelectedBookId(bookId);
    setTableAnchorEl(event.currentTarget);
  };
 
  const handleTableMenuClose = () => {
    setTableAnchorEl(null);
    setSelectedBookId(null);
  };
 
  const handleOpenDialog = () => {
    setOpen(true);
  };
 
  const handleCloseDialog = () => {
    setOpen(false);
    setBorrowDate(null);
    setReturnDate(null);
  };
 
  const handleConfirmBorrow = () => {
    console.log(`Borrowing book with ID: ${selectedBookId}`);
    console.log(`Borrow Date: ${borrowDate}`);
    console.log(`Return Date: ${returnDate}`);
    handleCloseDialog();
  };
 
  const handleDeleteBook = () => {
    handleTableMenuClose();
    setDenyDialogOpen(true);
  };
 
  const handleConfirmDeny = () => {
    console.log(`Book with ID: ${selectedBookId} has been denied.`);
    setDenyDialogOpen(false); // Close the deny confirmation dialog
  };
 
  const handleCancelDeny = () => {
    setDenyDialogOpen(false); // Close the deny confirmation dialog
  };
 
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '87CEFA' }}>
        <Toolbar>
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
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: 0 }}
      >
        <Toolbar />
        <Container>
          <Typography variant="h4" gutterBottom>
            Reservation
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date of Birth</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['21-1233-122'].map((id, index) => (
                  <TableRow key={index}>
                    <TableCell>{id}</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>21</TableCell>
                    <TableCell>November 1 2003</TableCell>
                    <TableCell>
                      <IconButton
                        aria-controls="table-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleTableMenuClick(event, id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="table-menu"
                        anchorEl={tableAnchorEl}
                        keepMounted
                        open={Boolean(tableAnchorEl) && selectedBookId === id}
                        onClose={handleTableMenuClose}
                      >
                        <MenuItem onClick={handleOpenDialog}>Approved</MenuItem>
                        <MenuItem onClick={handleDeleteBook}>Denied</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={open} onClose={handleCloseDialog}>
            <DialogTitle>Confirmation Borrow</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please confirm the borrowing details for the book.
              </DialogContentText>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date Started Borrowing"
                  value={borrowDate}
                  onChange={(newValue) => setBorrowDate(newValue)}
                  renderInput={(params) => <TextField {...params} margin="normal" fullWidth />}
                />
                <DatePicker
                  label="Set Returning Date"
                  value={returnDate}
                  onChange={(newValue) => setReturnDate(newValue)}
                  renderInput={(params) => <TextField {...params} margin="normal" fullWidth />}
                />
              </LocalizationProvider>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmBorrow} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
 
          {/* Deny Confirmation Dialog */}
          <Dialog open={denyDialogOpen} onClose={() => setDenyDialogOpen(false)}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to deny this reservation? Changes can't be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDeny} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDeny} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};
 
export default ReservationBooks;
 