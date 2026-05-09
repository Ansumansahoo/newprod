package com.chainmed.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * Product entity stored in PostgreSQL
 * Blockchain transaction hash stored for on-chain verification
 */
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Column(name = "batch_number", nullable = false, unique = true)
    private String batchNumber;

    @NotBlank
    @Column(nullable = false)
    private String manufacturer;

    @NotBlank
    @Column(nullable = false)
    private String category; // e.g., Antibiotic, Vaccine, Painkiller

    @Column(nullable = false)
    private LocalDateTime manufactureDate;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status;

    // Blockchain data
    @Column(name = "blockchain_product_id")
    private Long blockchainProductId; // ID on smart contract

    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash; // Registration transaction hash

    @Column(name = "current_holder_address")
    private String currentHolderAddress; // Ethereum address of current holder

    // Metadata
    private String description;
    private String storageConditions; // e.g., "2-8°C refrigerated"
    private Double price;
    private Integer quantity;
    private String imageUrl;

    @Column(name = "is_recalled")
    @Builder.Default
    private Boolean isRecalled = false;

    @Column(name = "recall_reason")
    private String recallReason;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ProductStatus {
        MANUFACTURED,
        IN_TRANSIT_TO_DISTRIBUTOR,
        AT_DISTRIBUTOR,
        IN_TRANSIT_TO_PHARMACY,
        AT_PHARMACY,
        IN_TRANSIT_TO_HOSPITAL,
        AT_HOSPITAL,
        DISPENSED,
        RECALLED
    }
}
