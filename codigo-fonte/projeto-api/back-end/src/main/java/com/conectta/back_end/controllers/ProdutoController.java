package com.conectta.back_end.controllers;

import com.conectta.back_end.models.Produto;
import com.conectta.back_end.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal; // Verifique se esta importação existe

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    // Endpoint para criar um novo produto
    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto produto) {
        Produto novoProduto = produtoRepository.save(produto);
        return ResponseEntity.ok(novoProduto);
    }
}