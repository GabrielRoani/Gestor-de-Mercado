package com.conectta.back_end.repositories;

import com.conectta.back_end.dtos.TopProdutoDTO;
import com.conectta.back_end.models.ItemVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Integer> {

    @Query("SELECT new com.conectta.back_end.dtos.TopProdutoDTO(iv.produto.id, iv.produto.nome, iv.produto.categoria, SUM(iv.quantidade), SUM(iv.subtotal)) " +
            "FROM ItemVenda iv " +
            "GROUP BY iv.produto.id, iv.produto.nome, iv.produto.categoria " +
            "ORDER BY SUM(iv.quantidade) DESC")
    List<TopProdutoDTO> findTopProdutos();
}