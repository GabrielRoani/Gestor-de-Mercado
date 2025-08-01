package com.conectta.back_end.repositories;

import com.conectta.back_end.models.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {
    // Contar produtos com estoque baixo (menor ou igual ao mínimo)
    @Query("SELECT count(p) FROM Produto p WHERE p.quantidadeEstoque > 0 AND p.quantidadeEstoque <= p.estoqueMinimo")
    long countByEstoqueBaixo();

    // Contar produtos fora de estoque (igual a zero)
    @Query("SELECT count(p) FROM Produto p WHERE p.quantidadeEstoque = 0")
    long countByForaDeEstoque();
}