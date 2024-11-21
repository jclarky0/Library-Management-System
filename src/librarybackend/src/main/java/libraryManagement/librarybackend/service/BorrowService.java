package libraryManagement.librarybackend.service;

import libraryManagement.librarybackend.entity.Borrow;
import libraryManagement.librarybackend.repository.BorrowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BorrowService {

    @Autowired
    private BorrowRepository borrowRepository;

    public Borrow saveBorrow(Borrow borrow) {
        return borrowRepository.save(borrow);
    }

    public List<Borrow> getBorrowsByUsername(String username) {
        return borrowRepository.findByUsername(username);
    }
}
