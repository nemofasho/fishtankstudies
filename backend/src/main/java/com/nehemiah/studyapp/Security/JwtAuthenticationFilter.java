package com.nehemiah.studyapp.Security;

import com.nehemiah.studyapp.Services.CustomUserDetailsService;
import com.nehemiah.studyapp.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtUtil jwtUtil,
            CustomUserDetailsService userDetailsService
    ) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService =
                userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        if (
                authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")
        ) {

            filterChain.doFilter(request, response);

            return;
        }

        String token =
                authorizationHeader.substring(7);

        try {

            if (jwtUtil.isTokenValid(token)) {

                String email =
                        jwtUtil.extractEmail(token);

                if (
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                == null
                ) {

                    UserDetails userDetails =
                            userDetailsService
                                    .loadUserByUsername(email);

                    UsernamePasswordAuthenticationToken
                            authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );
                }
            }

        } catch (Exception ignored) {
            // Invalid JWT. The request will be treated
            // as unauthenticated by Spring Security.
        }

        filterChain.doFilter(request, response);
    }
}