package com.conectta.back_end.controllers;

import com.conectta.back_end.dtos.DashboardStatsDTO;
import com.conectta.back_end.dtos.TopProdutoDTO;
import com.conectta.back_end.dtos.VendaStatsDTO;
import com.conectta.back_end.services.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Endpoint para buscar as estatísticas gerais do painel (cards superiores).
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        DashboardStatsDTO stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Endpoint para buscar as estatísticas de vendas de hoje e de ontem.
     */
    @GetMapping("/vendas-stats")
    public ResponseEntity<Map<String, VendaStatsDTO>> getVendasStats() {
        LocalDate hoje = LocalDate.now();
        LocalDate ontem = hoje.minusDays(1);

        VendaStatsDTO statsHoje = dashboardService.getVendasStats(hoje);
        VendaStatsDTO statsOntem = dashboardService.getVendasStats(ontem);

        Map<String, VendaStatsDTO> response = Map.of(
                "hoje", statsHoje,
                "ontem", statsOntem
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint para buscar os 5 produtos mais vendidos.
     */
    @GetMapping("/top-produtos")
    public ResponseEntity<List<TopProdutoDTO>> getTopProdutos() {
        List<TopProdutoDTO> topProdutos = dashboardService.getTopProdutos();
        return ResponseEntity.ok(topProdutos);
    }
}