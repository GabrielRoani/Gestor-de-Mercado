package com.conectta.back_end.repositories;

import com.conectta.back_end.models.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Integer> {

    @Query("SELECT COUNT(v) FROM Venda v WHERE v.dataVenda >= :inicio AND v.dataVenda < :fim")
    long countByDataVendaBetween(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT COALESCE(SUM(v.valorTotal), 0) FROM Venda v WHERE v.dataVenda >= :inicio AND v.dataVenda < :fim")
    BigDecimal sumValorTotalByDataVendaBetween(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);
}