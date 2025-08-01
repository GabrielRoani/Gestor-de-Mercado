package com.conectta.back_end.services;

import com.conectta.back_end.dtos.VendaRequest;
import com.conectta.back_end.models.*;
import com.conectta.back_end.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ItemVendaRepository itemVendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    @Transactional
    public Venda processarVenda(VendaRequest vendaRequest) {
        Usuario usuario = usuarioRepository.findById(vendaRequest.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Venda novaVenda = new Venda();
        novaVenda.setUsuario(usuario);
        novaVenda.setMetodoPagamento(vendaRequest.getMetodoPagamento());

        BigDecimal valorTotal = BigDecimal.ZERO;
        List<ItemVenda> itensVenda = new ArrayList<>();

        for (VendaRequest.ItemVendaRequest itemDto : vendaRequest.getItens()) {
            Produto produto = produtoRepository.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemDto.getProdutoId()));

            if (produto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            // Baixa no estoque
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - itemDto.getQuantidade());
            produtoRepository.save(produto);

            // Cria o item da venda
            ItemVenda itemVenda = new ItemVenda();
            itemVenda.setProduto(produto);
            itemVenda.setQuantidade(itemDto.getQuantidade());
            itemVenda.setPrecoUnitario(itemDto.getPrecoUnitario());
            itemVenda.setSubtotal(itemDto.getPrecoUnitario().multiply(new BigDecimal(itemDto.getQuantidade())));
            itemVenda.setVenda(novaVenda);
            itensVenda.add(itemVenda);

            valorTotal = valorTotal.add(itemVenda.getSubtotal());

            // Registra a movimentação de estoque
            MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
            movimentacao.setProduto(produto);
            movimentacao.setQuantidade(itemDto.getQuantidade());
            movimentacao.setTipoMovimentacao(MovimentacaoEstoque.TipoMovimentacao.SAIDA_VENDA);
            movimentacao.setUsuarioId(usuario.getId());
            movimentacao.setJustificativa("Venda #" + novaVenda.getId());
            movimentacaoEstoqueRepository.save(movimentacao);
        }

        novaVenda.setValorTotal(valorTotal);
        novaVenda.setItens(itensVenda);

        return vendaRepository.save(novaVenda);
    }
}