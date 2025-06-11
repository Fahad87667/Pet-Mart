package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.Date;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "products")
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    public enum PetType {
        DOG, CAT, BIRD, FISH, OTHER
    }

    @Id
    @Column(unique = true)
    private String code;

    private String name;

    @Enumerated(EnumType.STRING)
    private PetType type;

    private String breed;

    private String age;

    private String gender;

    @Column(length = 1000)
    private String description;

    private double price;

    private String status;

    private Date createDate;

    private String imagePath;
}
