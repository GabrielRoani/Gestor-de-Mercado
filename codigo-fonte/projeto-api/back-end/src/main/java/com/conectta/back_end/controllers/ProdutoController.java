package com.conectta.back_end.controllers;

import com.conectta.back_end.models.Produto;
import com.conectta.back_end.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List; // Importe a classe List
import java.util.Optional;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin("*")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    // Endpoint para criar um novo produto (já existente)
    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto produto) {
        Produto novoProduto = produtoRepository.save(produto);
        return ResponseEntity.ok(novoProduto);
    }

    // NOVO ENDPOINT para listar todos os produtos
    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        List<Produto> produtos = produtoRepository.findAll();
        return ResponseEntity.ok(produtos);
    }
    // READ (by ID): Endpoint para buscar um único produto pelo seu ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProdutoPorId(@PathVariable Integer id) {
        Optional<Produto> produto = produtoRepository.findById(id);
        if (produto.isPresent()) {
            return ResponseEntity.ok(produto.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // UPDATE: Endpoint para atualizar um produto existente
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Integer id, @RequestBody Produto detalhesProduto) {
        return produtoRepository.findById(id)
                .map(produtoExistente -> {
                    produtoExistente.setNome(detalhesProduto.getNome());
                    produtoExistente.setCodigoBarras(detalhesProduto.getCodigoBarras());
                    produtoExistente.setPrecoCusto(detalhesProduto.getPrecoCusto());
                    produtoExistente.setPrecoVenda(detalhesProduto.getPrecoVenda());
                    produtoExistente.setQuantidadeEstoque(detalhesProduto.getQuantidadeEstoque());
                    produtoExistente.setEstoqueMinimo(detalhesProduto.getEstoqueMinimo());
                    produtoExistente.setUnidadeMedida(detalhesProduto.getUnidadeMedida());

                    Produto produtoAtualizado = produtoRepository.save(produtoExistente);
                    return ResponseEntity.ok(produtoAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE: Endpoint para deletar um produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Integer id) {
        if (!produtoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        produtoRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // Retorna 204 No Content
    }
}