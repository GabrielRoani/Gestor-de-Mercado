package com.conectta.back_end.controllers;

import com.conectta.back_end.models.Usuario;
import com.conectta.back_end.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Listar todos os usuários
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        // Evitar expor a senha
        usuarios.forEach(u -> u.setSenha(null));
        return ResponseEntity.ok(usuarios);
    }

    // Buscar usuário por ID
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarUsuarioPorId(@PathVariable Integer id) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setSenha(null); // Nunca retorne a senha
                    return ResponseEntity.ok(usuario);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Criar um novo usuário
    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody Usuario usuario) {
        // Criptografar a senha antes de salvar
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        Usuario novoUsuario = usuarioRepository.save(usuario);
        novoUsuario.setSenha(null); // Não retornar a senha na resposta
        return ResponseEntity.ok(novoUsuario);
    }

    // Atualizar um usuário
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizarUsuario(@PathVariable Integer id, @RequestBody Usuario detalhesUsuario) {
        return usuarioRepository.findById(id)
                .map(usuarioExistente -> {
                    usuarioExistente.setLogin(detalhesUsuario.getLogin());
                    usuarioExistente.setCargo(detalhesUsuario.getCargo());
                    // Se uma nova senha for fornecida, criptografe-a
                    if (detalhesUsuario.getSenha() != null && !detalhesUsuario.getSenha().isEmpty()) {
                        usuarioExistente.setSenha(passwordEncoder.encode(detalhesUsuario.getSenha()));
                    }
                    Usuario usuarioAtualizado = usuarioRepository.save(usuarioExistente);
                    usuarioAtualizado.setSenha(null);
                    return ResponseEntity.ok(usuarioAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Deletar um usuário
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Integer id) {
        if (!usuarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}