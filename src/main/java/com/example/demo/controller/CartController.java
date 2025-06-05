package com.example.demo.controller;

import com.example.demo.model.CartInfo;
import com.example.demo.service.CartService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CartController {

    private static final Logger logger = LoggerFactory.getLogger(CartController.class);

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<?> getCart(HttpServletRequest request) {
        try {
            CartInfo cartInfo = cartService.getCartInSession(request);
            return ResponseEntity.ok(cartInfo);
        } catch (Exception e) {
            logger.error("Error fetching cart: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch cart");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody Map<String, Object> request,
            HttpServletRequest httpRequest) {
        try {
            String productCode = (String) request.get("code");
            int quantity = (int) request.get("quantity");

            cartService.addProductToCart(productCode, quantity, httpRequest);
            CartInfo cartInfo = cartService.getCartInSession(httpRequest);
            return ResponseEntity.ok(cartInfo);
        } catch (Exception e) {
            logger.error("Error adding to cart: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to add to cart");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateCart(
            @RequestBody Map<String, Object> request,
            HttpServletRequest httpRequest) {
        try {
            String productCode = (String) request.get("code");
            int quantity = (int) request.get("quantity");

            cartService.updateProductQuantity(productCode, quantity, httpRequest);
            CartInfo cartInfo = cartService.getCartInSession(httpRequest);
            return ResponseEntity.ok(cartInfo);
        } catch (Exception e) {
            logger.error("Error updating cart: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update cart");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeFromCart(
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        try {
            String productCode = request.get("code");
            
            if (productCode == null || productCode.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid request");
                error.put("message", "Product code is required");
                return ResponseEntity.badRequest().body(error);
            }

            CartInfo cartInfo = cartService.getCartInSession(httpRequest);
            if (cartInfo == null || cartInfo.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cart is empty");
                error.put("message", "No items to remove from cart");
                return ResponseEntity.badRequest().body(error);
            }

            cartService.removeProduct(productCode, httpRequest);
            cartInfo = cartService.getCartInSession(httpRequest);
            return ResponseEntity.ok(cartInfo);
        } catch (Exception e) {
            logger.error("Error removing from cart: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to remove from cart");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(HttpServletRequest request) {
        try {
            cartService.removeCartInSession(request);
            return ResponseEntity.ok("Cart cleared successfully");
        } catch (Exception e) {
            logger.error("Error clearing cart: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to clear cart");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(HttpServletRequest request) {
        try {
            CartInfo cartInfo = cartService.getCartInSession(request);
            if (cartInfo == null || cartInfo.getCartLines().isEmpty()) {
                return ResponseEntity.badRequest().body("Cart is empty");
            }

            // Process checkout logic here
            // For now, just clear the cart
            cartService.removeCartInSession(request);
            return ResponseEntity.ok("Checkout successful");
        } catch (Exception e) {
            logger.error("Error during checkout: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Checkout failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
} 