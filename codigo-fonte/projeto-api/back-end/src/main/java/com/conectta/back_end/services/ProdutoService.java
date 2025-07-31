package com.conectta.back_end.services;

import com.conectta.back_end.models.Produto;
import com.conectta.back_end.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    // CREATE
    @Transactional
    public Produto criarProduto(Produto produto) {
        // Aqui você pode adicionar validações antes de salvar.
        // Por exemplo, verificar se um código de barras já existe.
        return produtoRepository.save(produto);
    }

    // READ (Get All)
    @Transactional(readOnly = true)
    public List<Produto> listarTodosProdutos() {
        return produtoRepository.findAll();
    }

    // READ (Get by ID)
    @Transactional(readOnly = true)
    public Optional<Produto> buscarProdutoPorId(Integer id) {
        return produtoRepository.findById(id);
    }

    // UPDATE
    @Transactional
    public Produto atualizarProduto(Integer id, Produto detalhesProduto) {
        // Busca o produto no banco ou lança uma exceção se não encontrar
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com o ID: " + id));

        // Atualiza os campos do produto existente com os novos dados
        produto.setNome(detalhesProduto.getNome());
        produto.setCodigoBarras(detalhesProduto.getCodigoBarras());
        produto.setPrecoCusto(detalhesProduto.getPrecoCusto());
        produto.setPrecoVenda(detalhesProduto.getPrecoVenda());
        produto.setQuantidadeEstoque(detalhesProduto.getQuantidadeEstoque());
        produto.setEstoqueMinimo(detalhesProduto.getEstoqueMinimo());
        produto.setUnidadeMedida(detalhesProduto.getUnidadeMedida());

        return produtoRepository.save(produto);
    }

    // DELETE
    @Transactional
    public void deletarProduto(Integer id) {
        // Verifica se o produto existe antes de tentar deletar
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado com o ID: " + id);
        }
        produtoRepository.deleteById(id);
    }
}