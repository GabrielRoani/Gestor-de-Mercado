package com.conectta.back_end.controllers;

import com.conectta.back_end.dtos.EntradaEstoqueRequest;
import com.conectta.back_end.services.EstoqueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estoque")
@CrossOrigin("*")
public class EstoqueController {

    @Autowired
    private EstoqueService estoqueService;

    @PostMapping("/entradas")
    public ResponseEntity<Void> registrarEntrada(@RequestBody EntradaEstoqueRequest request) {
        estoqueService.registrarEntrada(request);
        return ResponseEntity.ok().build();
    }
}