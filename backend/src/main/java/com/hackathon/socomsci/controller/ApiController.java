package com.hackathon.socomsci.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/hello")
    public Map<String, String> hello() 
    {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Hello from Tech Team!");
        return response;
    }
} 