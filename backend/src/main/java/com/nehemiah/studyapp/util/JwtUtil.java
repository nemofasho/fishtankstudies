package com.nehemiah.studyapp.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;

    private final long expirationTime;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationTime
    ) {
        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.expirationTime = expirationTime;
    }

    public String generateToken(String email) {

        Date now = new Date();

        Date expiration = new Date(
                now.getTime() + expirationTime
        );

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    public String extractEmail(String token) {

        return extractClaims(token)
                .getSubject();
    }

    public boolean isTokenValid(String token) {

        try {

            extractClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }

    private Claims extractClaims(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}