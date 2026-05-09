package com.chainmed.controller;

import com.chainmed.model.Product;
import com.chainmed.service.ProductService;
import com.chainmed.dto.ProductRequest;
import com.chainmed.dto.ProductResponse;
import com.chainmed.dto.StatusUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * REST API Controller for ChainMed Product Management
 * All product data is synced with the Ethereum blockchain
 */
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "https://newprod-chainmed.vercel.app"})
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * GET /api/products - Get all products (paginated)
     */
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    /**
     * GET /api/products/{id} - Get product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }

    /**
     * GET /api/products/batch/{batchNumber} - Get product by batch number
     */
    @GetMapping("/batch/{batchNumber}")
    public ResponseEntity<ProductResponse> getByBatch(@PathVariable String batchNumber) {
        return ResponseEntity.ok(productService.getByBatchNumber(batchNumber));
    }

    /**
     * POST /api/products - Register new product (records on blockchain)
     */
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.registerProduct(request));
    }

    /**
     * PATCH /api/products/{id}/status - Update product status (updates blockchain)
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ProductResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(productService.updateProductStatus(id, request));
    }

    /**
     * GET /api/products/{id}/history - Get full supply chain history
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<List<Map<String, Object>>> getHistory(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductHistory(id));
    }

    /**
     * GET /api/products/{id}/verify - Verify product authenticity on blockchain
     */
    @GetMapping("/{id}/verify")
    public ResponseEntity<Map<String, Object>> verifyProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.verifyProduct(id));
    }

    /**
     * POST /api/products/{id}/recall - Recall a product
     */
    @PostMapping("/{id}/recall")
    public ResponseEntity<ProductResponse> recallProduct(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(productService.recallProduct(id, body.get("reason")));
    }

    /**
     * GET /api/products/search - Search products
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String manufacturer,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(productService.searchProducts(name, manufacturer, status));
    }

    /**
     * GET /api/products/stats - Dashboard statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(productService.getDashboardStats());
    }
}
