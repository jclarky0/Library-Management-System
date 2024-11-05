import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import axios from 'axios';
 
const RequestBorrow = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
 
  useEffect(() => {
    // Fetch book details using the bookId
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/books/${bookId}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };
 
    fetchBook();
  }, [bookId]);
 
  const handleConfirmBorrow = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('No username found in localStorage. Please log in first.');
      return;
    }
 
    try {
      const borrowRequest = {
        bookTitle: book.title,
        status: 'Pending'
      };
 
      await axios.post(`http://localhost:8080/book-requests/request-borrow?username=${username}`, borrowRequest);
      alert('Borrow request sent successfully!');
    } catch (error) {
      console.error('Error sending borrow request:', error);
      alert('Failed to send borrow request.');
    }
  };
 
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Request to Borrow Book
      </Typography>
      {book ? (
        <>
          <Typography variant="h5" gutterBottom>
            <strong>{book.title}</strong> (ID: {bookId})
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmBorrow}
          >
            Request Borrow
          </Button>
        </>
      ) : (
        <Typography variant="body1" gutterBottom>
          Loading book details...
        </Typography>
      )}
    </Box>
  );
};
 
export default RequestBorrow;