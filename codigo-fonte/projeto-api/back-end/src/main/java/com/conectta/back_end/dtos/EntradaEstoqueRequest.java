package com.conectta.back_end.dtos;

import lombok.Data;
import java.math.BigDecimal; // Importe a classe BigDecimal
import java.util.List;

@Data
public class EntradaEstoqueRequest {
    private String justificativa;
    private List<ItemEntrada> produtos;

    @Data
    public static class ItemEntrada {
        private Integer produtoId;
        private Integer quantidade;

        // Altere de Double para BigDecimal
        private BigDecimal novoPrecoCusto;

        // Altere de Double para BigDecimal
        private BigDecimal novoPrecoVenda;
    }
}