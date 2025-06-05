package com.example.demo.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ProductForm {

    private String code;

    private String name;

    private String type; // Stored as String, will be mapped to PetType enum

    private String breed;

    private String age;

    private String gender;

    private String description;

    private double price;

    private String status;

    private MultipartFile fileData; // For image upload (optional)

    private boolean newProduct = false; // To distinguish between create/edit

    public ProductForm() {
    }

    public ProductForm(Product product) {
        this.code = product.getCode();
        this.name = product.getName();
        this.type = product.getType().name();
        this.breed = product.getBreed();
        this.age = product.getAge();
        this.gender = product.getGender();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.status = product.getStatus();
        this.newProduct = false;
    }
}
