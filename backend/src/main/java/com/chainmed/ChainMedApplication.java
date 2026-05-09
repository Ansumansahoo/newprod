package com.chainmed;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.bind.annotation.CrossOrigin;

/**
 * ChainMed - Decentralized Medical Supply Chain Application
 * 
 * Main Spring Boot Application Entry Point
 * 
 * Tech Stack:
 * - Java 17 + Spring Boot 3
 * - PostgreSQL (open source database)
 * - Web3j (Ethereum blockchain integration)
 * - Solidity Smart Contracts on Ethereum
 */
@SpringBootApplication
@EnableAsync
public class ChainMedApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChainMedApplication.class, args);
        System.out.println("\n===========================================");
        System.out.println("  ChainMed Backend Started Successfully!");
        System.out.println("  API: http://localhost:8080/api");
        System.out.println("  Docs: http://localhost:8080/swagger-ui.html");
        System.out.println("===========================================\n");
    }
}
