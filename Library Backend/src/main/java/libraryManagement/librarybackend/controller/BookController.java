package libraryManagement.librarybackend.controller;

import libraryManagement.librarybackend.entity.Book;
import libraryManagement.librarybackend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public Book createBook(
            @RequestParam("isbn") String isbn,
            @RequestParam("name") String name,
            @RequestParam("author") String author,
            @RequestParam("category") String category,
            @RequestParam("quantity") int quantity,
            @RequestParam("deweyDecimal") double deweyDecimal,
            @RequestParam("photo") MultipartFile photo) {

        Book book = new Book();
        book.setIsbn(isbn);
        book.setTitle(name);
        book.setAuthor(author);
        book.setCategory(category);
        book.setQuantity(quantity);
        book.setDeweyDecimal(BigDecimal.valueOf(deweyDecimal));

        if (!photo.isEmpty()) {
            try {
                book.setPhoto(photo.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return bookService.saveBook(book);
    }

    @PutMapping(path = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<Book> updateBook(
            @PathVariable Long id,
            @RequestParam("isbn") String isbn,
            @RequestParam("name") String name,
            @RequestParam("author") String author,
            @RequestParam("category") String category,
            @RequestParam("quantity") int quantity,
            @RequestParam("deweyDecimal") double deweyDecimal,
            @RequestParam(value = "photo", required = false) MultipartFile photo) {

        Book existingBook = bookService.getBookById(id);
        if (existingBook == null) {
            return ResponseEntity.notFound().build();
        }

        existingBook.setIsbn(isbn);
        existingBook.setTitle(name);
        existingBook.setAuthor(author);
        existingBook.setCategory(category);
        existingBook.setQuantity(quantity);
        existingBook.setDeweyDecimal(BigDecimal.valueOf(deweyDecimal));

        if (photo != null && !photo.isEmpty()) {
            try {
                existingBook.setPhoto(photo.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        Book savedBook = bookService.saveBook(existingBook);
        return ResponseEntity.ok(savedBook);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }
}