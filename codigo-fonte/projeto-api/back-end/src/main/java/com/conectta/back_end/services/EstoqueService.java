package com.conectta.back_end.services;

import com.conectta.back_end.dtos.EntradaEstoqueRequest;
import com.conectta.back_end.models.MovimentacaoEstoque;
import com.conectta.back_end.models.Produto;
import com.conectta.back_end.repositories.MovimentacaoEstoqueRepository;
import com.conectta.back_end.repositories.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EstoqueService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    @Transactional
    public void registrarEntrada(EntradaEstoqueRequest request) {
        Integer usuarioLogadoId = 1; // Simulação: o ideal é pegar da autenticação

        for (EntradaEstoqueRequest.ItemEntrada item : request.getProdutos()) {
            Produto produto = produtoRepository.findById(item.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado com ID: " + item.getProdutoId()));

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + item.getQuantidade());
            if (item.getNovoPrecoCusto() != null) {
                produto.setPrecoCusto(item.getNovoPrecoCusto());
            }
            if (item.getNovoPrecoVenda() != null) {
                produto.setPrecoVenda(item.getNovoPrecoVenda());
            }
            produtoRepository.save(produto);

            MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
            movimentacao.setProduto(produto);
            movimentacao.setQuantidade(item.getQuantidade());
            movimentacao.setTipoMovimentacao(MovimentacaoEstoque.TipoMovimentacao.ENTRADA_COMPRA);
            movimentacao.setUsuarioId(usuarioLogadoId);
            movimentacao.setJustificativa(request.getJustificativa());
            movimentacaoEstoqueRepository.save(movimentacao);
        }
    }
}