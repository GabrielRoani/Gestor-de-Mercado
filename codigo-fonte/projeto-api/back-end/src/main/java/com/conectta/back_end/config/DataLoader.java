package com.conectta.back_end.config;

import com.conectta.back_end.models.Usuario;
import com.conectta.back_end.repositories.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Verifica se a base de dados já tem utilizadores
            if (usuarioRepository.count() == 0) {
                System.out.println("Base de dados vazia. A criar utilizadores padrão...");

                // A senha é a mesma para todos
                String senhaPadrao = "senha123";

                // Administrador
                Usuario admin = new Usuario();
                admin.setLogin("admin");
                admin.setSenha(passwordEncoder.encode(senhaPadrao));
                admin.setCargo("ADMINISTRADOR");
                usuarioRepository.save(admin);

                // Vendedor
                Usuario vendedor = new Usuario();
                vendedor.setLogin("vendedor");
                vendedor.setSenha(passwordEncoder.encode(senhaPadrao));
                vendedor.setCargo("VENDEDOR");
                usuarioRepository.save(vendedor);

                // Estoquista
                Usuario estoquista = new Usuario();
                estoquista.setLogin("estoquista");
                estoquista.setSenha(passwordEncoder.encode(senhaPadrao));
                estoquista.setCargo("ESTOQUISTA");
                usuarioRepository.save(estoquista);

                System.out.println("Utilizadores padrão criados com sucesso!");
            }
        };
    }
}