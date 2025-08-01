package com.conectta.back_end.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class VendaRequest {
    private String metodoPagamento;
    private Integer usuarioId;
    private List<ItemVendaRequest> itens;

    @Data
    public static class ItemVendaRequest {
        private Integer produtoId;
        private Integer quantidade;
        private BigDecimal precoUnitario;
    }
}