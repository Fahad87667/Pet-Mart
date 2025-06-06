package com.example.demo.repository;

import com.example.demo.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Custom query methods can be added here if needed
    List<Reservation> findByCustomerEmail(String customerEmail);
} 