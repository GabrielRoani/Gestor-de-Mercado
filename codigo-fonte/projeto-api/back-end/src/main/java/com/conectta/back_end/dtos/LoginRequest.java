package com.conectta.back_end.dtos;

import lombok.Data;

@Data
public class LoginRequest {
    private String login;
    private String senha;
}