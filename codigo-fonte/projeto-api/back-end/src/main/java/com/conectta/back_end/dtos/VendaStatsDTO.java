package com.conectta.back_end.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendaStatsDTO {
    private long vendas;
    private BigDecimal faturamento;
    private long transacoes;
}