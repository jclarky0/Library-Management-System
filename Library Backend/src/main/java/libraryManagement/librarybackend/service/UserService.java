package libraryManagement.librarybackend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import libraryManagement.librarybackend.entity.PasswordResetToken;
import libraryManagement.librarybackend.entity.User;
import libraryManagement.librarybackend.repository.PasswordResetTokenRepository;
import libraryManagement.librarybackend.repository.UserRepository;

@Service
public class UserService {

    public static final int ROLE_USER = 1;
    public static final int ROLE_LIBRARIAN = 2;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    public User registerUser(String username, String email, String password, int role, boolean enabled) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setEnabled(enabled);
        user.setStatus("ACTIVE"); // Default status is ACTIVE

        return userRepository.save(user);
    }

    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail));
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public void sendPasswordResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            PasswordResetToken passwordResetToken = new PasswordResetToken(token, user);
            passwordResetTokenRepository.save(passwordResetToken);
            // Implement your logic to send the email with the reset token
        }
    }

    public boolean resetPassword(String token, String newPassword) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token).orElse(null);
        if (passwordResetToken != null && !passwordResetToken.isExpired()) {
            User user = passwordResetToken.getUser();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            passwordResetTokenRepository.delete(passwordResetToken);
            return true;
        }
        return false;
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setEnabled(updatedUser.isEnabled());
        user.setStatus(updatedUser.getStatus()); // Ensure status can be updated
        // Update other fields as needed
        return userRepository.save(user);
    }

    public User approveUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setEnabled(true);
        return userRepository.save(user);
    }

    public User declineUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.delete(user);
        return user;
    }

    public List<User> getRestrictedUsers() {
        return userRepository.findByStatus("RESTRICTED");
    }

    public User updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        return userRepository.save(user);
    }

    public List<User> getPendingRestrictionRequests() {
        return userRepository.findByStatus("PENDING_RESTRICTION");
    }
    public User findUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getPendingUnrestrictRequests() {
        return userRepository.findByStatus("PENDING_UNRESTRICT");
    }
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

}
