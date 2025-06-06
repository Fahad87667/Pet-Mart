package com.example.demo.model;

import java.util.ArrayList;
import java.util.List;
import com.example.demo.model.CustomerInfo;

public class CartInfo {

    private int orderNum;

    private CustomerInfo customerInfo;

    private List<CartLineInfo> cartLines = new ArrayList<>();

    private double totalAmount;

    private int totalQuantity;

    public CartInfo() {

    }

    public int getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(int orderNum) {
        this.orderNum = orderNum;
    }

    public CustomerInfo getCustomerInfo() {
        return customerInfo;
    }

    public void setCustomerInfo(CustomerInfo customerInfo) {
        this.customerInfo = customerInfo;
    }

    public List<CartLineInfo> getCartLines() {
        return cartLines;
    }

    public void setCartLines(List<CartLineInfo> cartLines) {
        this.cartLines = cartLines;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(int totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    private CartLineInfo findLineByCode(String code) {
        for (CartLineInfo line : this.cartLines) {
            if (line.getProductInfo().getCode().equals(code)) {
                return line;
            }
        }
        return null;
    }

    public void addProduct(ProductInfo productInfo, int quantity) {
        System.out.println("Attempting to add product: " + productInfo.getCode() + " with quantity: " + quantity);
        CartLineInfo line = this.findLineByCode(productInfo.getCode());

        if (line == null) {
            System.out.println("Product not found in cart. Adding new line.");
            // If product is not in the cart, add a new line
            line = new CartLineInfo();
            line.setProductInfo(productInfo);
            line.setQuantity(quantity); // Set initial quantity
            this.cartLines.add(line);
            System.out.println("New line added. Cart size: " + this.cartLines.size());
        } else {
            System.out.println("Product found in cart. Updating quantity.");
            System.out.println("Current quantity: " + line.getQuantity());
            // If product is already in the cart, update quantity
            int newQuantity = line.getQuantity() + quantity;
            System.out.println("New quantity: " + newQuantity);
            if (newQuantity <= 0) {
                this.cartLines.remove(line);
                System.out.println("Quantity <= 0. Removing line. Cart size: " + this.cartLines.size());
            } else {
                line.setQuantity(newQuantity);
                System.out.println("Quantity updated.");
            }
        }
        System.out.println("Finished addProduct for: " + productInfo.getCode());
    }

    public void validate() {

    }

    public void updateProduct(String code, int quantity) {
        CartLineInfo line = this.findLineByCode(code);

        if (line != null) {
            if (quantity <= 0) {
                this.cartLines.remove(line);
            } else {
                line.setQuantity(quantity);
            }
        }
    }

    public void removeProduct(ProductInfo productInfo) {
        CartLineInfo line = this.findLineByCode(productInfo.getCode());
        if (line != null) {
            this.cartLines.remove(line);
        }
    }

    public boolean isEmpty() {
        return cartLines == null || cartLines.isEmpty();
    }

    public boolean isValidCustomer() {
        return this.customerInfo != null && this.customerInfo.isValid();
    }

    public int getQuantityTotal() {
        int quantity = 0;
        for (CartLineInfo line : this.cartLines) {
            quantity += line.getQuantity();
        }
        return quantity;
    }

    public double getAmountTotal() {
        double total = 0;
        for (CartLineInfo line : this.cartLines) {
            total += line.getAmount();
        }
        return total;
    }

    public void updateQuantity(CartInfo cartForm) {
        if (cartForm != null && cartForm.getCartLines() != null) {
            List<CartLineInfo> lines = cartForm.getCartLines();
            for (CartLineInfo line : lines) {
                if (line != null && line.getProductInfo() != null) {
                    String code = line.getProductInfo().getCode();
                    int quantity = line.getQuantity();
                    this.updateProduct(code, quantity);
                }
            }
        }
    }

}
