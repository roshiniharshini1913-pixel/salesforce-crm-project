package com.crm.service;

import com.crm.entity.User;
import com.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> authenticate(String username, String rawPassword) {
        return userRepository.findByUsername(username)
                .filter(u -> passwordEncoder.matches(rawPassword, u.getPassword()));
    }

    /**
     * Demo-purpose token generator. In a production system this would be a signed JWT;
     * here we base64-encode a simple payload so the frontend has a persistent session
     * token without adding external JWT dependencies.
     */
    public String generateToken(User user) {
        String payload = user.getUsername() + ":" + user.getRole() + ":" + System.currentTimeMillis();
        return Base64.getEncoder().encodeToString(payload.getBytes());
    }
}
