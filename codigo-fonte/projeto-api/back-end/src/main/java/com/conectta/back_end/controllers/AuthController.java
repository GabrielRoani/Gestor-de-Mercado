package com.conectta.back_end.controllers;

import com.conectta.back_end.dtos.LoginRequest;
import com.conectta.back_end.services.JwtService; // Importe
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails; // Importe
import org.springframework.security.core.userdetails.UserDetailsService; // Importe
import org.springframework.web.bind.annotation.*;

import java.util.Map; // Importe

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService; // Injetar JwtService

    @Autowired
    private UserDetailsService userDetailsService; // Injetar UserDetailsService

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getLogin(),
                        loginRequest.getSenha()
                )
        );

        // Se a autenticação for bem-sucedida, gere e retorne o token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getLogin());
        final String jwt = jwtService.generateToken(userDetails);

        // Retorna o token em um objeto JSON
        return ResponseEntity.ok(Map.of("token", jwt));
    }
}