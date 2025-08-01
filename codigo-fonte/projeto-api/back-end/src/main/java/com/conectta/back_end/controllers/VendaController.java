package com.conectta.back_end.controllers;

import com.conectta.back_end.dtos.VendaRequest;
import com.conectta.back_end.models.Venda;
import com.conectta.back_end.services.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendas")
@CrossOrigin("*")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    @PostMapping
    public ResponseEntity<Venda> criarVenda(@RequestBody VendaRequest vendaRequest) {
        try {
            Venda novaVenda = vendaService.processarVenda(vendaRequest);
            return ResponseEntity.ok(novaVenda);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}