package com.example.demo.model;

import com.example.demo.entity.Customer;

public class CustomerInfo {

    private String name;
    private String address;
    private String email;
    private String phone;

    private boolean valid;

    private String preferredVisitDate;
    private String message;

    public CustomerInfo() {

    }

    public CustomerInfo(Customer customer) {
        this.name = customer.getName();
        this.address = customer.getAddress();
        this.email = customer.getEmail();
        this.phone = customer.getPhone();
        this.valid = customer.isValid();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getPreferredVisitDate() {
        return preferredVisitDate;
    }

    public void setPreferredVisitDate(String preferredVisitDate) {
        this.preferredVisitDate = preferredVisitDate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}