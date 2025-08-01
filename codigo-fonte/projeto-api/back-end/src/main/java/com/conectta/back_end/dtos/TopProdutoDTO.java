package com.conectta.back_end.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopProdutoDTO {
    private Integer id;
    private String nome;
    private String categoria;
    private Long unidadesVendidas;
    private BigDecimal receita;
}