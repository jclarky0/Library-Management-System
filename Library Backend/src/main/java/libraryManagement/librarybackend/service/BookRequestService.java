package libraryManagement.librarybackend.service;

import libraryManagement.librarybackend.entity.BookRequest;
import libraryManagement.librarybackend.entity.User;
import libraryManagement.librarybackend.repository.BookRequestRepository;
import libraryManagement.librarybackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookRequestService {

    @Autowired
    private BookRequestRepository bookRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public List<BookRequest> getAllRequests() {
        return bookRequestRepository.findAllByStatus("Pending");
    }

    public void confirmRequest(Long requestId) {
        BookRequest request = bookRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("Borrowed");
        request.setBorrowDate(LocalDateTime.now());
        request.setReturnDate(LocalDateTime.now().plusDays(7)); // Example: set return date to one week after borrowing
        bookRequestRepository.save(request);
    }

    public void denyRequest(Long requestId) {
        BookRequest request = bookRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("Denied");
        bookRequestRepository.save(request);
    }

    public BookRequest saveBookRequest(BookRequest bookRequest, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        bookRequest.setUser(user);
        return bookRequestRepository.save(bookRequest);
    }

    public List<BookRequest> getRequestsByUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return bookRequestRepository.findByUser(user);
    }
    public void returnBook(Long requestId) {
        BookRequest request = bookRequestRepository.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus("Returned");
        bookRequestRepository.save(request);
    }
    public List<BookRequest> getBorrowedBooks() {
        return bookRequestRepository.findByStatus("Borrowed");
    }
    public List<BookRequest> getReturnedBooks() {
        return bookRequestRepository.findByStatus("Returned");
    }

}
