package com.conectta.back_end.services;

import com.conectta.back_end.models.Usuario;
import com.conectta.back_end.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections; // Importar a classe Collections

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Utilizador não encontrado com o login: " + login));

        // Cria uma permissão (autoridade) com base no cargo do utilizador
        // O prefixo "ROLE_" é uma convenção do Spring Security
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + usuario.getCargo());

        return new User(
                usuario.getLogin(),
                usuario.getSenha(),
                Collections.singletonList(authority) // Adiciona a permissão à lista
        );
    }
}