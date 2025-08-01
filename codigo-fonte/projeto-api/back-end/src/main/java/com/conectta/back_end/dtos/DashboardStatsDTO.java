package com.conectta.back_end.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalProdutos;
    private long produtosEstoqueBaixo;
    private long produtosForaDeEstoque;
    private long totalUsuarios;
    private long usuariosAtivos;
}