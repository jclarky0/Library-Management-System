import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import Login from './Login';
import Register from './Register';
import reportWebVitals from './reportWebVitals';
import ForgotPassword from './ForgotPassword';
import StudDashboard from './StudDashboard'; // Corrected path
import PersonalInfo from './PersonalInfo';
import ChangePassword from './ChangePassword';
import RequestBorrow from './RequestBorrow';
import BorrowList from './BorrowList';
import AddBook from './AddBook';
import LibrarianDashboard from './LibrarianDashboard';
import LibrarianPersonalInfo from './LibrarianPersonalInfo';
import LibChangePassword from './LibChangePassword';
import ViewBooks from './ViewBooks';
import AddBookList from './AddBookList';
import ReservationBooks from './ReservationBooks';
import RequestedBooks from './RequestedBooks';
import IssueBooks from './issueBooks';
import ReturnBooks from './ReturnBooks'
import RestrictedAccount from './RestrictedAccount';
import AdminDashboard from './AdminDashboard';

 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/studdashboard" element={<StudDashboard />} />
        <Route path="/personalinfo" element={<PersonalInfo />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/borrowlist" element={<BorrowList />} />
        <Route path="/librariandashboard" element={<LibrarianDashboard />} />
        <Route path="/addbook" element={<AddBook />} />
        <Route path="/librarianpersonalinfo" element={<LibrarianPersonalInfo/>} />
        <Route path="/libchangepassword" element={<LibChangePassword/>} />
        <Route path="/viewbooks" element={<ViewBooks/>} />
        <Route path="/addbooklist" element={<AddBookList/>} />
        <Route path="/reservationbooks" element={<ReservationBooks/>} />
        <Route path="/request-borrow/:bookId" element={<RequestBorrow />} />
        <Route path="/RequestedBooks" element={<RequestedBooks />} />
        <Route path="/IssueBooks" element={<IssueBooks />} />
        <Route path="/ReturnBooks" element={<ReturnBooks />} />
        <Route path="/RestrictedAccount" element={<RestrictedAccount />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        
      </Routes>
    </Router>
  </React.StrictMode>
);
 
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();