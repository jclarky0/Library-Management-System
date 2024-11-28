package libraryManagement.librarybackend.controller;

import libraryManagement.librarybackend.entity.Borrow;
import libraryManagement.librarybackend.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/borrow")
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    @PostMapping
    public Borrow borrowBook(@RequestBody Borrow borrow) {
        borrow.setBorrowDate(new Date());
        borrow.setStatus("Borrowed");
        return borrowService.saveBorrow(borrow);
    }

    @GetMapping("/{username}")
    public List<Borrow> getBorrowedBooks(@PathVariable String username) {
        return borrowService.getBorrowsByUsername(username);
    }
}
