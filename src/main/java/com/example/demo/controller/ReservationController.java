package com.example.demo.controller;

import com.example.demo.entity.Reservation;
import com.example.demo.entity.Product;
import com.example.demo.service.ReservationService;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/reservations")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReservationController {

    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllReservations() {
        try {
            List<Reservation> reservations = reservationService.getAllReservations();
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            logger.error("Error fetching reservations: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch reservations");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateReservationStatus(
            @PathVariable("id") Long id,
            @RequestBody Map<String, String> statusUpdate) {
        logger.info("Received status update request for reservation ID: {} with status: {}", id, statusUpdate);
        
        try {
            String newStatus = statusUpdate.get("status");
            if (newStatus == null) {
                logger.warn("Status update request missing status field for reservation ID: {}", id);
                return ResponseEntity.badRequest().body("Status is required");
            }

            logger.debug("Fetching reservation with ID: {}", id);
            Reservation reservation = reservationService.getReservationById(id);
            if (reservation == null) {
                logger.warn("Reservation not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }

            logger.info("Updating reservation status from {} to {} for reservation ID: {}", 
                reservation.getStatus(), newStatus, id);
            
            // Update reservation status
            reservation.setStatus(newStatus);
            Reservation updatedReservation = reservationService.updateReservation(reservation);
            logger.info("Successfully updated reservation status to: {}", updatedReservation.getStatus());

            // Update product status based on reservation status
            Product product = reservation.getProduct();
            if (product != null) {
                String oldProductStatus = product.getStatus();
                if ("ACCEPTED".equalsIgnoreCase(newStatus)) {
                    product.setStatus("ADOPTED");
                } else if ("REJECTED".equalsIgnoreCase(newStatus)) {
                    product.setStatus("AVAILABLE");
                }
                Product updatedProduct = productRepository.save(product);
                logger.info("Updated product status from {} to {} for product code: {}", 
                    oldProductStatus, updatedProduct.getStatus(), updatedProduct.getCode());
            } else {
                logger.warn("No product associated with reservation ID: {}", id);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Reservation status updated successfully");
            response.put("reservation", updatedReservation);
            
            logger.info("Successfully completed status update for reservation ID: {}", id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid status update request for reservation ID {}: {}", id, e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid status");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            logger.error("Error updating reservation status for ID {}: {}", id, e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update reservation status");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getReservationById(@PathVariable("id") Long id) {
        try {
            Reservation reservation = reservationService.getReservationById(id);
            return ResponseEntity.ok(reservation);
        } catch (IllegalArgumentException e) {
            logger.error("Reservation not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Error fetching reservation: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch reservation");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
} 