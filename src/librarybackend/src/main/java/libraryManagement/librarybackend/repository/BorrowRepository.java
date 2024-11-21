package libraryManagement.librarybackend.repository;

import libraryManagement.librarybackend.entity.Borrow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowRepository extends JpaRepository<Borrow, Long> {
    List<Borrow> findByUsername(String username);
}
