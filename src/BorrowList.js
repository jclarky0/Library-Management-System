import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, AppBar, Toolbar, IconButton,
  Menu, MenuItem, TextField, InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const BorrowList = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    navigate('/');
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  const handlePersonalInfoClick = () => {
    navigate('/personalinfo'); // Navigate to PersonalInfo page
  };

  const handleReturnBook = async (requestId) => {
    try {
      await axios.post(`http://localhost:8080/book-requests/${requestId}/return`);
      alert('Book returned successfully');
      fetchBorrowedBooks();
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book.');
    }
  };

  const fetchBorrowedBooks = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('No username found in localStorage. Please log in first.');
      navigate('/');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/book-requests/user/${username}`);
      setBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  useEffect(() => {
    setFilteredBooks(
      books.filter((book) =>
        book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, books]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        padding: 2,
      }}
    >
      <AppBar sx={{ backgroundColor: '#2196f3' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBackClick} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LMS
          </Typography>
          <Typography variant="body1" component="div" sx={{ color: 'white', marginRight: 2 }}>
            {localStorage.getItem('username')}
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
            <MenuItem onClick={handlePersonalInfoClick}>Personal Information</MenuItem>
            <MenuItem onClick={() => navigate('/borrowlist')}>Borrowed Book</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box sx={{ width: '100%', paddingTop: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              marginBottom: 4,
              position: 'sticky',
              top: 64,
              backgroundColor: '#f0f0f0',
              zIndex: 1,
              paddingTop: 2,
              paddingBottom: 2,
              textAlign: 'left',
              width: '100%',
            }}
          >
            Book Borrowed List
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Search by title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: '50%', marginBottom: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="borrowed books table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Borrow and Return Timeline</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.id}</TableCell>
                  <TableCell>{book.bookTitle}</TableCell>
                  <TableCell>
                    {book.borrowDate ? `${new Date(book.borrowDate).toLocaleDateString()} - ${new Date(book.returnDate).toLocaleDateString()}` : 'N/A'}
                  </TableCell>
                  <TableCell>{book.status}</TableCell>
                  <TableCell>
                    {book.status === 'Borrowed' && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleReturnBook(book.id)}
                      >
                        Return
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default BorrowList;
