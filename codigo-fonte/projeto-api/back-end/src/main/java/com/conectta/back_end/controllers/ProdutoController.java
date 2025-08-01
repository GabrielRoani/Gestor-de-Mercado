package com.conectta.back_end.controllers;

import com.conectta.back_end.models.Produto;
import com.conectta.back_end.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin("*")
public class ProdutoController {

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping
    public ResponseEntity<Produto> criarProduto(@RequestBody Produto produto) {
        Produto novoProduto = produtoRepository.save(produto);
        return ResponseEntity.ok(novoProduto);
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        List<Produto> produtos = produtoRepository.findAll();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProdutoPorId(@PathVariable Integer id) {
        Optional<Produto> produto = produtoRepository.findById(id);
        return produto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(@PathVariable Integer id, @RequestBody Produto detalhesProduto) {
        return produtoRepository.findById(id)
                .map(produtoExistente -> {
                    produtoExistente.setNome(detalhesProduto.getNome());
                    produtoExistente.setDescricao(detalhesProduto.getDescricao());
                    produtoExistente.setCodigoBarras(detalhesProduto.getCodigoBarras());
                    produtoExistente.setPrecoCusto(detalhesProduto.getPrecoCusto());
                    produtoExistente.setPrecoVenda(detalhesProduto.getPrecoVenda());
                    produtoExistente.setQuantidadeEstoque(detalhesProduto.getQuantidadeEstoque());
                    produtoExistente.setEstoqueMinimo(detalhesProduto.getEstoqueMinimo());
                    produtoExistente.setUnidadeMedida(detalhesProduto.getUnidadeMedida());
                    produtoExistente.setCategoria(detalhesProduto.getCategoria());
                    produtoExistente.setFornecedor(detalhesProduto.getFornecedor());

                    Produto produtoAtualizado = produtoRepository.save(produtoExistente);
                    return ResponseEntity.ok(produtoAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Integer id) {
        if (!produtoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        produtoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}