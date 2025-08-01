package com.conectta.back_end.services;

import com.conectta.back_end.dtos.DashboardStatsDTO;
import com.conectta.back_end.dtos.TopProdutoDTO;
import com.conectta.back_end.dtos.VendaStatsDTO;
import com.conectta.back_end.repositories.ItemVendaRepository;
import com.conectta.back_end.repositories.ProdutoRepository;
import com.conectta.back_end.repositories.UsuarioRepository;
import com.conectta.back_end.repositories.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ItemVendaRepository itemVendaRepository;

    /**
     * Busca as estatísticas gerais do dashboard.
     * @return Um DTO com os totais de produtos, usuários, etc.
     */
    public DashboardStatsDTO getDashboardStats() {
        long totalProdutos = produtoRepository.count();
        long produtosEstoqueBaixo = produtoRepository.countByEstoqueBaixo();
        long produtosForaDeEstoque = produtoRepository.countByForaDeEstoque();
        long totalUsuarios = usuarioRepository.count();
        // A lógica de "usuários ativos" é uma simulação, já que não temos o campo.
        // Em um sistema real, isso viria de uma verificação de sessão ou status.
        long usuariosAtivos = totalUsuarios > 0 ? totalUsuarios - 1 : 0;

        return new DashboardStatsDTO(
                totalProdutos,
                produtosEstoqueBaixo,
                produtosForaDeEstoque,
                totalUsuarios,
                usuariosAtivos
        );
    }

    /**
     * Calcula as estatísticas de vendas para uma data específica.
     * @param date A data para a qual as estatísticas serão calculadas.
     * @return Um DTO com o número de vendas, faturamento e transações.
     */
    public VendaStatsDTO getVendasStats(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        long vendas = vendaRepository.countByDataVendaBetween(startOfDay, endOfDay);
        BigDecimal faturamento = vendaRepository.sumValorTotalByDataVendaBetween(startOfDay, endOfDay);

        // Consideramos que o número de transações é igual ao número de vendas.
        return new VendaStatsDTO(vendas, faturamento, vendas);
    }

    /**
     * Busca os 5 produtos mais vendidos com base na quantidade.
     * @return Uma lista de DTOs representando os produtos mais vendidos.
     */
    public List<TopProdutoDTO> getTopProdutos() {
        return itemVendaRepository.findTopProdutos().stream()
                .limit(5)
                .collect(Collectors.toList());
    }
}