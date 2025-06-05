package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;
import lombok.Getter;

@Entity
@Table(name = "reservations")
@Getter
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerAddress; // Assuming address is needed for reservation

    @Column(name = "preferred_visit_date")
    private String preferredVisitDate; // Storing as String for now, can be changed to Date

    @Column(length = 1000)
    private String message;

    private Date reservationDate;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_code")
    private Product product;

    // Store cart items details as a JSON string or in a related table
    // For simplicity, storing as a string for now
    @Column(columnDefinition = "TEXT")
    private String reservedItemsDetails;

    public enum ReservationStatus {
        PENDING,
        ACCEPTED,
        REJECTED
    }

    // Manual setters
    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public void setPreferredVisitDate(String preferredVisitDate) {
        this.preferredVisitDate = preferredVisitDate;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setReservationDate(Date reservationDate) {
        this.reservationDate = reservationDate;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public void setReservedItemsDetails(String reservedItemsDetails) {
        this.reservedItemsDetails = reservedItemsDetails;
    }

    public void setStatus(Object status) {
        if (status instanceof ReservationStatus) {
            this.status = (ReservationStatus) status;
        } else if (status instanceof String) {
            try {
                this.status = ReservationStatus.valueOf(((String) status).toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status: " + status + ". Must be one of: PENDING, ACCEPTED, REJECTED");
            }
        } else {
            throw new IllegalArgumentException("Status must be either ReservationStatus enum or String");
        }
    }
} 