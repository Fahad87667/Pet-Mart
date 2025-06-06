package com.example.demo.service;

import com.example.demo.entity.Reservation;
import com.example.demo.entity.Reservation.ReservationStatus;
import com.example.demo.model.CartInfo;
import com.example.demo.model.CustomerInfo;
import com.example.demo.repository.ReservationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private CartService cartService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Reservation createReservationFromCart(
            CartInfo cartInfo,
            CustomerInfo customerInfo) throws JsonProcessingException {

        if (cartInfo == null || cartInfo.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty.");
        }

        if (customerInfo == null || !customerInfo.isValid()) {
            throw new IllegalArgumentException("Invalid customer information.");
        }

        Reservation reservation = new Reservation();
        reservation.setCustomerName(customerInfo.getName());
        reservation.setCustomerEmail(customerInfo.getEmail());
        reservation.setCustomerPhone(customerInfo.getPhone());
        reservation.setCustomerAddress(customerInfo.getAddress());
        reservation.setPreferredVisitDate(customerInfo.getPreferredVisitDate()); // Assuming preferredVisitDate is in CustomerInfo
        reservation.setMessage(customerInfo.getMessage()); // Assuming message is in CustomerInfo
        reservation.setReservationDate(new Date());
        reservation.setStatus(ReservationStatus.PENDING);

        // Store cart items details as JSON string
        String reservedItemsDetails = objectMapper.writeValueAsString(cartInfo.getCartLines());
        reservation.setReservedItemsDetails(reservedItemsDetails);

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with ID: " + id));
    }

    public Reservation updateReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    public Reservation updateReservationStatus(Long id, ReservationStatus status) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }

    // New method to get reservations by customer email
    public List<Reservation> getReservationsByCustomerEmail(String customerEmail) {
        return reservationRepository.findByCustomerEmail(customerEmail);
    }

    // You might want methods to get reservations by status, customer, etc.
} 