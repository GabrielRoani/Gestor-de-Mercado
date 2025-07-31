package com.conectta.back_end.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal; // Importe a classe BigDecimal

@Entity
@Table(name = "produtos")
@Data
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String codigoBarras;
    private String nome;

    // Altere de Double para BigDecimal
    private BigDecimal precoVenda;

    // Altere de Double para BigDecimal
    private BigDecimal precoCusto;

    private Integer quantidadeEstoque;
    private Integer estoqueMinimo;
    private String unidadeMedida;
}