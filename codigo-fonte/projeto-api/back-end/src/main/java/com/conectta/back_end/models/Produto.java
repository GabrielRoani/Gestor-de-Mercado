package com.conectta.back_end.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "produtos")
@Data
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String codigoBarras;
    private String nome;
    private String descricao; // NOVO CAMPO
    private String categoria; // NOVO CAMPO
    private String fornecedor; // NOVO CAMPO

    private BigDecimal precoVenda;
    private BigDecimal precoCusto;

    private Integer quantidadeEstoque;
    private Integer estoqueMinimo;
    private String unidadeMedida;
}