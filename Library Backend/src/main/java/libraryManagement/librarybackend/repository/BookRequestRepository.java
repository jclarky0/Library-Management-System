package libraryManagement.librarybackend.repository;

import libraryManagement.librarybackend.entity.BookRequest;
import libraryManagement.librarybackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    List<BookRequest> findAllByStatus(String status);
    List<BookRequest> findByStatus(String status);
    List<BookRequest> findByUser(User user); // Add this method
}