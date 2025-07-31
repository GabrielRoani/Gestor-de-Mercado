package com.conectta.back_end.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Entity
@Table(name = "movimentacoes_estoque")
@Data
public class MovimentacaoEstoque {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    @Enumerated(EnumType.STRING)
    private TipoMovimentacao tipoMovimentacao;

    private Integer quantidade;
    private Instant dataMovimentacao = Instant.now();
    private Integer usuarioId;
    private String justificativa;

    public enum TipoMovimentacao {
        ENTRADA_COMPRA,
        SAIDA_VENDA,
        BAIXA_PERDA,
        AJUSTE_INVENTARIO
    }
}