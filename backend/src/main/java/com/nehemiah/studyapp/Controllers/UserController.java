package com.nehemiah.studyapp.Controllers;

import com.nehemiah.studyapp.models.User;

import jakarta.validation.Valid;

import com.nehemiah.studyapp.Services.UserService;
import com.nehemiah.studyapp.dto.user.CreateUserRequest;
import com.nehemiah.studyapp.dto.user.UpdateUserRequest;
import com.nehemiah.studyapp.dto.user.UserResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserResponse> getAllUsers() {
    return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
    return userService.createUser(request);
}

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        return userService.updateUser(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);

        return "User deleted successfully";
    }
}
