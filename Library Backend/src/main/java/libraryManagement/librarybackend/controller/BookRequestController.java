package libraryManagement.librarybackend.controller;

import libraryManagement.librarybackend.entity.BookRequest;
import libraryManagement.librarybackend.service.BookRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/book-requests")
public class BookRequestController {

    @Autowired
    private BookRequestService bookRequestService;

    @GetMapping
    public List<BookRequest> getAllRequests() {
        return bookRequestService.getAllRequests();
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<BookRequest>> getRequestsByUser(@PathVariable String username) {
        return ResponseEntity.ok(bookRequestService.getRequestsByUser(username));
    }

    @PostMapping("/request-borrow")
    public ResponseEntity<BookRequest> requestBorrow(@RequestParam String username, @RequestBody BookRequest bookRequest) {
        bookRequest.setRequestDate(LocalDateTime.now());
        bookRequest.setStatus("Pending");
        BookRequest savedRequest = bookRequestService.saveBookRequest(bookRequest, username);
        return ResponseEntity.ok(savedRequest);
    }

    @PostMapping("/{requestId}/confirm")
    public void confirmRequest(@PathVariable Long requestId) {
        bookRequestService.confirmRequest(requestId);
    }

    @PostMapping("/{requestId}/deny")
    public void denyRequest(@PathVariable Long requestId) {
        bookRequestService.denyRequest(requestId);
    }
    @PostMapping("/{requestId}/return")
    public ResponseEntity<String> returnBook(@PathVariable Long requestId) {
        try {
            bookRequestService.returnBook(requestId);
            return ResponseEntity.ok("Book returned successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to return book");
        }
    }
    @GetMapping("/borrowed")
    public List<BookRequest> getBorrowedBooks() {
        return bookRequestService.getBorrowedBooks();
    }
    @GetMapping("/returned")
    public List<BookRequest> getReturnedBooks() {
        return bookRequestService.getReturnedBooks();
    }

}
