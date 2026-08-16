package com.crm.controller;

import com.crm.dto.LoginRequest;
import com.crm.dto.LoginResponse;
import com.crm.entity.User;
import com.crm.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<User> user = authService.authenticate(request.getUsername(), request.getPassword());
        if (user.isPresent()) {
            String token = authService.generateToken(user.get());
            LoginResponse response = new LoginResponse(token, user.get().getUsername(),
                    user.get().getFullName(), user.get().getRole());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid username or password"));
    }
}
