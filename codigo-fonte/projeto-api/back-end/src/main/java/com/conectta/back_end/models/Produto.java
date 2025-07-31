package com.conectta.back_end.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "produtos")
@Data
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String codigoBarras;
    private String nome;
    private Double precoVenda;
    private Double precoCusto;
    private Integer quantidadeEstoque;
    private Integer estoqueMinimo;
    private String unidadeMedida;
}