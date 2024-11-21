package libraryManagement.librarybackend.controller;

import libraryManagement.librarybackend.dto.LoginRequest;
import libraryManagement.librarybackend.dto.LoginResponse;
import libraryManagement.librarybackend.entity.User;
import libraryManagement.librarybackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        if (loginRequest.getUsername() == null || loginRequest.getUsername().isEmpty() ||
                loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Username/email and password must be provided");
        }

        Optional<User> userOpt = userService.findByUsernameOrEmail(loginRequest.getUsername());
        if (userOpt.isEmpty() || !userService.checkPassword(loginRequest.getPassword(), userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body("Invalid username/email or password");
        }

        User user = userOpt.get();
        if (user.getStatus().equals("RESTRICTED")) {
            return ResponseEntity.status(403).body("Your account has been restricted. Please contact the administrator.");
        }

        if (!user.isEnabled()) {
            return ResponseEntity.status(403).body("User account not approved by admin");
        }

        LoginResponse loginResponse = new LoginResponse(user.getUsername(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(user.getUsername(), user.getEmail(), user.getPassword(), user.getRole(), user.isEnabled());
            return ResponseEntity.ok(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        try {
            User approvedUser = userService.approveUser(id);
            return ResponseEntity.ok(approvedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    @PutMapping("/{id}/decline")
    public ResponseEntity<?> declineUser(@PathVariable Long id) {
        try {
            User declinedUser = userService.declineUser(id);
            return ResponseEntity.ok(declinedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }

    @GetMapping("/restricted-users")
    public ResponseEntity<List<User>> getRestrictedUsers() {
        List<User> restrictedUsers = userService.getRestrictedUsers();
        return ResponseEntity.ok(restrictedUsers);
    }

    @PostMapping("/restrict-user/{id}")
    public ResponseEntity<User> restrictUser(@PathVariable Long id) {
        User restrictedUser = userService.updateUserStatus(id, "PENDING_RESTRICTION");
        return ResponseEntity.ok(restrictedUser);
    }

    @GetMapping("/pending-restriction-requests")
    public ResponseEntity<List<User>> getPendingRestrictionRequests() {
        List<User> pendingRequests = userService.getPendingRestrictionRequests();
        return ResponseEntity.ok(pendingRequests);
    }

    @PostMapping("/approve-restriction/{id}")
    public ResponseEntity<User> approveRestriction(@PathVariable Long id) {
        try {
            User updatedUser = userService.updateUserStatus(id, "RESTRICTED");
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/deny-restriction/{id}")
    public ResponseEntity<User> denyRestriction(@PathVariable Long id) {
        try {
            User user = userService.findUserById(id);
            String previousStatus = user.isEnabled() ? "ACTIVE" : "INACTIVE";
            User updatedUser = userService.updateUserStatus(id, previousStatus);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/unrestrict-user/{id}")
    public ResponseEntity<User> unrestrictUser(@PathVariable Long id) {
        User unrestrictedUser = userService.updateUserStatus(id, "PENDING_UNRESTRICT");
        return ResponseEntity.ok(unrestrictedUser);
    }

    @PostMapping("/approve-unrestrict/{id}")
    public ResponseEntity<User> approveUnrestrict(@PathVariable Long id) {
        try {
            User user = userService.findUserById(id);
            String previousStatus = user.isEnabled() ? "ACTIVE" : "INACTIVE";
            User updatedUser = userService.updateUserStatus(id, previousStatus);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/deny-unrestrict/{id}")
    public ResponseEntity<User> denyUnrestrict(@PathVariable Long id) {
        try {
            User updatedUser = userService.updateUserStatus(id, "RESTRICTED");
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    @GetMapping("/pending-unrestrict-requests")
    public ResponseEntity<List<User>> getPendingUnrestrictRequests() {
        List<User> pendingUnrestrictRequests = userService.getPendingUnrestrictRequests();
        return ResponseEntity.ok(pendingUnrestrictRequests);
    }
}
