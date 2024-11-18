import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
 
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedUsername = localStorage.getItem('username');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
    fetchBooks();
  }, []);
 
  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/books');
      console.log('Fetched books:', response.data);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };
 
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
 
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
      const borrowRequest = {
        bookTitle: selectedBook.title,
        status: 'Pending'
      };
 
      await axios.post(`http://localhost:8080/book-requests/request-borrow?username=${username}`, borrowRequest);
      alert('Borrow request sent successfully!');
      setDialogOpen(false);
      setSelectedBook(null);
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
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar>
        <Toolbar style={{ backgroundColor: '87CEFA', minHeight: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <div
              onClick={() => handleCategoryClick('All')}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
                Library Management System
              </Typography>
            </div>
          </div>
 
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" component="div" sx={{ color: 'white', marginRight: 2 }}>
              {email}
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
              <MenuItem onClick={() => navigate('/personalinfo')}>Personal Information</MenuItem>
              <MenuItem onClick={() => navigate('/BorrowList')}>Borrowed Book</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, marginTop: 8 }}>
        <Button variant="outlined" sx={{ margin: 1 }} onClick={() => handleCategoryClick('All')}><BookIcon/>All Books</Button>
        <Button variant="outlined" sx={{ margin: 1 }} onClick={() => handleCategoryClick('Nursing')}><LocalHospitalIcon/>Nursing</Button>
        <Button variant="outlined" sx={{ margin: 1 }} onClick={() => handleCategoryClick('IT')}><ComputerIcon/> IT</Button>
        <Button variant="outlined" sx={{ margin: 1 }} onClick={() => handleCategoryClick('Civil Engineer')}><ConstructionTwoToneIcon/>Civil Engineer</Button>
        <Button variant="outlined" sx={{ margin: 1 }} onClick={() => handleCategoryClick('Electrical Engineering')}><ElectricBoltTwoToneIcon/>Electrical Engineering</Button>
        <Button variant="outlined" sx={{ margin: 1 }} onClick={() => handleCategoryClick('Business Administration')}><BusinessCenterTwoToneIcon/>Business Administration</Button>
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, flexWrap: 'wrap', gap: 2, padding: 2 }}>
        {filteredBooks.map((book, index) => (
          <Card key={index} sx={{ maxWidth: 345 }}>
            <CardMedia
              component="img"
              alt={book.title}
              height="140"
              image={book.photo ? `data:image/jpeg;base64,${book.photo}` : 'placeholder-image-url'} // Provide a placeholder image URL
              title={book.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Author: {book.author}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" color="primary" onClick={() => handleBorrowClick(book)}>
                Borrow now!
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to borrow the book "{selectedBook?.title}" by {selectedBook?.author}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmBorrow} color="primary" variant="contained">
            Confirm
          </Button>
          <Button onClick={handleDialogClose} color="primary" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
 
export default StudDashboard;