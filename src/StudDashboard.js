import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import BookIcon from '@mui/icons-material/Book';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ConstructionTwoToneIcon from '@mui/icons-material/ConstructionTwoTone';
import ComputerIcon from '@mui/icons-material/Computer';
import ElectricBoltTwoToneIcon from '@mui/icons-material/ElectricBoltTwoTone';
import BusinessCenterTwoToneIcon from '@mui/icons-material/BusinessCenterTwoTone';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

const StudDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state?.username || localStorage.getItem('username');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedUsername = localStorage.getItem('username');
    if (storedEmail) setEmail(storedEmail);
    if (storedUsername) setUsername(storedUsername);
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedBook(null);
  };

  const handleConfirmBorrow = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('No username found in localStorage. Please log in first.');
      return;
    }
    try {
      const borrowRequest = { bookTitle: selectedBook.title, status: 'Pending' };
      await axios.post(
        `http://localhost:8080/book-requests/request-borrow?username=${username}`,
        borrowRequest
      );
      alert('Borrow request sent successfully!');
      handleDialogClose();
    } catch (error) {
      console.error('Error sending borrow request:', error);
      alert('Failed to send borrow request.');
    }
  };

  const filteredBooks = books.filter((book) =>
    (selectedCategory === 'All' || book.category === selectedCategory) &&
    book.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar>
        <Toolbar style={{ backgroundColor: '87CEFA', minHeight: 50 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'white', flexGrow: 1 }}>
            Library Management System
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', marginRight: 2 }}>
            {user}
          </Typography>
          <IconButton onClick={handleMenuOpen} color="inherit">
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => navigate('/personalinfo')}>Personal Information</MenuItem>
            <MenuItem onClick={() => navigate('/BorrowList')}>Borrowed Books</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, marginTop: 8 }}>
        {/* Category Buttons */}
        {['All', 'Nursing', 'IT', 'Civil Engineering', 'Electrical Engineering', 'Business Administration', 'Others'].map(
          (category, index) => (
            <Button
              key={index}
              variant="outlined"
              sx={{ margin: 1 }}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </Button>
          )
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '50%' }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: 2, justifyContent: 'center' }}>
        {filteredBooks.map((book, index) => (
          <Card key={index} sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt={book.title}
              height="140"
              image={book.photo ? `data:image/jpeg;base64,${book.photo}` : 'placeholder-image-url'}
              title={book.title}
            />
            <CardContent>
              <Typography variant="h5">{book.title}</Typography>
              <Typography color="text.secondary">Author: {book.author}</Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" onClick={() => handleBorrowClick(book)}>
                Borrow now!
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to borrow the book "{selectedBook?.title}" by {selectedBook?.author}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmBorrow} variant="contained">
            Confirm
          </Button>
          <Button onClick={handleDialogClose} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudDashboard;
