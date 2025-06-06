package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.Product;
import com.example.demo.entity.Reservation;
import com.example.demo.model.CartInfo;
import com.example.demo.model.CartLineInfo;
import com.example.demo.model.CustomerInfo;
import com.example.demo.model.ProductInfo;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.CartService;
import com.example.demo.service.ReservationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RestApiController {

    private static final Logger logger = LoggerFactory.getLogger(RestApiController.class);

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ReservationService reservationService;

    @GetMapping("/products/{code}")
    public ResponseEntity<?> getProduct(@PathVariable String code) {
        Product product = productRepository.findById(code).orElse(null);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new ProductInfo(product));
    }

    @PostMapping("/reservations")
    @PreAuthorize("isAuthenticated()") // Ensure user is authenticated
    @Transactional
    public ResponseEntity<?> createReservation(
            HttpServletRequest request,
            @Valid @RequestBody CustomerInfo customerInfo) {

        try {
            CartInfo cartInfo = cartService.getCartInSession(request);

            if (cartInfo == null || cartInfo.isEmpty()) {
                return ResponseEntity.badRequest().body("Cart is empty. Cannot create a reservation.");
            }

            // Create reservation and clear cart in the same transaction
            Reservation reservation = reservationService.createReservationFromCart(cartInfo, customerInfo);
            cartService.removeCartInSession(request);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Reservation created successfully");
            response.put("reservation", reservation);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error creating reservation", e);
            return ResponseEntity.internalServerError().body("Error creating reservation: " + e.getMessage());
        }
    }

}
