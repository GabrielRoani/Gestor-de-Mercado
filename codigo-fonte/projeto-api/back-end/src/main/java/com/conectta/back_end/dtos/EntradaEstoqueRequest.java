package com.conectta.back_end.dtos;

import lombok.Data;
import java.util.List;

@Data
public class EntradaEstoqueRequest {
    private String justificativa;
    private List<ItemEntrada> produtos;

    @Data
    public static class ItemEntrada {
        private Integer produtoId;
        private Integer quantidade;
        private Double novoPrecoCusto;
        private Double novoPrecoVenda;
    }
}