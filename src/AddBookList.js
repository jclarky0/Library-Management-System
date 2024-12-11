import React, { useState, useEffect } from 'react';
import { Box, Container, AppBar, Toolbar, Divider, List, ListItem, ListItemIcon, ListItemText, CssBaseline, Drawer, IconButton, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme } from '@mui/material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RestoreIcon from '@mui/icons-material/Restore';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import axios from 'axios';

const drawerWidth = 240;

const AddBookList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [books, setBooks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [editBookId, setEditBookId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editingBookId, setEditingBookId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [updateConfirmOpen, setUpdateConfirmOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [bookToUpdate, setBookToUpdate] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    axios.get('http://localhost:8080/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  };

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
  };

  const handleTableMenuClose = () => {
    setSelectedBookId(null);
  };

  const handleEditBook = (book) => {
    setEditingBookId(book.id);
    setEditBookId(book.id);
    setEditFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      deweyDecimal: book.deweyDecimal,
      quantity: book.quantity,
      photo: null,
    });
  };

  const handleCancelEdit = () => {
    setEditingBookId(null);
    setEditBookId(null);
    setEditFormData({});
  };

  const handleSaveBook = (bookId, updatedBookData) => {
    const formData = new FormData();
    formData.append('isbn', updatedBookData.isbn);
    formData.append('name', updatedBookData.title);
    formData.append('author', updatedBookData.author);
    formData.append('category', updatedBookData.category);
    formData.append('quantity', updatedBookData.quantity);
    formData.append('deweyDecimal', updatedBookData.deweyDecimal);
    if (updatedBookData.photo) {
      formData.append('photo', updatedBookData.photo);
    }

    setBookToUpdate({ bookId, formData });
    setUpdateConfirmOpen(true);
  };

  const handleConfirmUpdate = () => {
    const { bookId, formData } = bookToUpdate;
    axios.put(`http://localhost:8080/books/${bookId}`, formData)
      .then(response => {
        console.log('Book updated successfully:', response.data);
        setEditingBookId(null);
        fetchBooks();
      })
      .catch(error => {
        console.error('Error updating book:', error);
      });
    setUpdateConfirmOpen(false);
  };

  const handleDeleteBook = (bookId) => {
    setBookToDelete(bookId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    axios.delete(`http://localhost:8080/books/${bookToDelete}`)
      .then(() => {
        setBooks(books.filter(book => book.id !== bookToDelete));
        setDeleteConfirmOpen(false);
        handleTableMenuClose();
      })
      .catch(error => {
        console.error('Error deleting book:', error);
        setDeleteConfirmOpen(false);
      });
  };
  const handleAddBook = () => {
    navigate('/AddBook');
  };

  const handleEditFormChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'photo') {
      setEditFormData({
        ...editFormData,
        [name]: files[0],
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    handleSaveBook(editBookId, editFormData);
    setEditBookId(null);
  };

  const base64ToImage = (base64) => {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    const blob = new Blob([bytes], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar style={{ backgroundColor: theme.palette.primary.main }}>
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
          '& .MuiDrawer-paper': {
            width: drawerWidth,
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
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: 0 }}
      >
        <Toolbar />
        <Container>
          <Typography variant="h4" gutterBottom>
            Books
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddBook}>
              Add Book
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>ISBN</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Dewey Decimal</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Photo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(books) && books.length > 0 ? (
                  books.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>{editingBookId === book.id ? (
                        <TextField
                          name="title"
                          value={editFormData.title || ''}
                          onChange={handleEditFormChange}
                        />
                      ) : book.title}</TableCell>
                      <TableCell>{editingBookId === book.id ? (
                        <TextField
                          name="author"
                          value={editFormData.author || ''}
                          onChange={handleEditFormChange}
                        />
                      ) : book.author}</TableCell>
                      <TableCell>{editingBookId === book.id ? (
                        <TextField
                          name="isbn"
                          value={editFormData.isbn || ''}
                          onChange={handleEditFormChange}
                        />
                      ) : book.isbn}</TableCell>
                      <TableCell>{editingBookId === book.id ? (
                        <TextField
                          name="category"
                          value={editFormData.category || ''}
                          onChange={handleEditFormChange}
                        />
                      ) : book.category}</TableCell>
                      <TableCell>{editingBookId === book.id ? (
                        <TextField
                          name="deweyDecimal"
                          value={editFormData.deweyDecimal || ''}
                          onChange={handleEditFormChange}
                        />
                      ) : book.deweyDecimal}</TableCell>
                      <TableCell>{editingBookId === book.id ? (
                        <TextField
                          name="quantity"
                          value={editFormData.quantity || ''}
                          onChange={handleEditFormChange}
                        />
                      ) : book.quantity}</TableCell>
                      <TableCell>
                        {editingBookId === book.id ? (
                          <input
                            type="file"
                            name="photo"
                            onChange={handleEditFormChange}
                          />
                        ) : (
                          book.photo && (
                            <img
                              src={base64ToImage(book.photo)}
                              alt={book.title}
                              style={{ width: '50px', height: '50px' }}
                            />
                          )
                        )}
                      </TableCell>
                      <TableCell>
                        {editingBookId === book.id ? (
                          <div>
                            <IconButton onClick={() => handleSaveBook(book.id, editFormData)}>
                              <CheckIcon />
                            </IconButton>
                            <IconButton onClick={handleCancelEdit}>
                              <CancelIcon />
                            </IconButton>
                          </div>
                        ) : (
                          <div>
                            <IconButton onClick={() => handleEditBook(book)}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteBook(book.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No books available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this book?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={updateConfirmOpen}
        onClose={() => setUpdateConfirmOpen(false)}
      >
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update this book?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmUpdate} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddBookList;
