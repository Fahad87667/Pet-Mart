package com.example.demo.service;

import com.example.demo.model.CartInfo;
import com.example.demo.model.CartLineInfo;
import com.example.demo.model.ProductInfo;
import com.example.demo.entity.Product;
import com.example.demo.entity.PersistentCart;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.PersistentCartRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class CartService {

    private static final Logger logger = LoggerFactory.getLogger(CartService.class);
    private static final String CART_SESSION_KEY = "myCart";

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PersistentCartRepository persistentCartRepository;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Get the shopping cart from the HTTP session.
     * If it doesn't exist, create a new one and save it.
     */
    public CartInfo getCartInSession(HttpServletRequest request) {
        HttpSession session = request.getSession();
        CartInfo cartInfo = (CartInfo) session.getAttribute(CART_SESSION_KEY);

        if (cartInfo == null) {
            // Try to load from persistent storage if user is logged in
            String userId = getUserIdFromSession(session);
            if (userId != null) {
                cartInfo = loadCartFromPersistentStorage(userId);
            }
            
            if (cartInfo == null) {
                cartInfo = new CartInfo();
            }
            session.setAttribute(CART_SESSION_KEY, cartInfo);
        }

        return cartInfo;
    }

    private String getUserIdFromSession(HttpSession session) {
        // Get user ID from session - implement based on your authentication system
        return (String) session.getAttribute("userId");
    }

    private CartInfo loadCartFromPersistentStorage(String userId) {
        try {
            return persistentCartRepository.findByUserId(userId)
                .map(persistentCart -> {
                    try {
                        return objectMapper.readValue(persistentCart.getCartData(), CartInfo.class);
                    } catch (Exception e) {
                        logger.error("Error deserializing cart data", e);
                        return null;
                    }
                })
                .orElse(null);
        } catch (Exception e) {
            logger.error("Error loading cart from persistent storage", e);
            return null;
        }
    }

    public void saveCartToPersistentStorage(String userId, CartInfo cartInfo) {
        try {
            String cartData = objectMapper.writeValueAsString(cartInfo);
            PersistentCart persistentCart = persistentCartRepository.findByUserId(userId)
                .orElse(new PersistentCart());
            
            persistentCart.setUserId(userId);
            persistentCart.setCartData(cartData);
            persistentCartRepository.save(persistentCart);
        } catch (Exception e) {
            logger.error("Error saving cart to persistent storage", e);
        }
    }

    /**
     * Remove the shopping cart from the session.
     */
    public void removeCartInSession(HttpServletRequest request) {
        HttpSession session = request.getSession();
        String userId = getUserIdFromSession(session);
        if (userId != null) {
            persistentCartRepository.deleteByUserId(userId);
        }
        session.removeAttribute(CART_SESSION_KEY);
    }

    /**
     * Store the last ordered cart in the session for later reference.
     */
    public void storeLastOrderedCartInSession(HttpServletRequest request, CartInfo cartInfo) {
        request.getSession().setAttribute("lastOrderedCart", cartInfo);
    }

    /**
     * Retrieve the last ordered cart from the session.
     */
    public CartInfo getLastOrderedCartInSession(HttpServletRequest request) {
        return (CartInfo) request.getSession().getAttribute("lastOrderedCart");
    }

    public void addProductToCart(String productCode, int quantity, HttpServletRequest request) {
        Product product = productRepository.findById(productCode)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productCode));

        CartInfo cartInfo = getCartInSession(request);
        CartLineInfo line = findLineByCode(cartInfo, productCode);

        if (line == null) {
            line = new CartLineInfo();
            ProductInfo productInfo = new ProductInfo(product);
            line.setProductInfo(productInfo);
            line.setQuantity(quantity);
            cartInfo.getCartLines().add(line);
        } else {
            line.setQuantity(line.getQuantity() + quantity);
        }

        updateCartTotals(cartInfo);
        
        // Save to persistent storage if user is logged in
        String userId = getUserIdFromSession(request.getSession());
        if (userId != null) {
            saveCartToPersistentStorage(userId, cartInfo);
        }
    }

    public void updateProductQuantity(String productCode, int quantity, HttpServletRequest request) {
        CartInfo cartInfo = getCartInSession(request);
        CartLineInfo line = findLineByCode(cartInfo, productCode);

        if (line != null) {
            if (quantity <= 0) {
                cartInfo.getCartLines().remove(line);
            } else {
                line.setQuantity(quantity);
            }
            updateCartTotals(cartInfo);
        }
    }

    public void removeProduct(String productCode, HttpServletRequest request) {
        if (productCode == null || productCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Product code cannot be null or empty");
        }

        CartInfo cartInfo = getCartInSession(request);
        if (cartInfo == null) {
            throw new IllegalStateException("Cart not found in session");
        }

        CartLineInfo line = findLineByCode(cartInfo, productCode);
        if (line == null) {
            throw new IllegalArgumentException("Product not found in cart: " + productCode);
        }

        cartInfo.getCartLines().remove(line);
        updateCartTotals(cartInfo);
    }

    private CartLineInfo findLineByCode(CartInfo cartInfo, String productCode) {
        return cartInfo.getCartLines().stream()
                .filter(line -> line.getProductInfo().getCode().equals(productCode))
                .findFirst()
                .orElse(null);
    }

    private void updateCartTotals(CartInfo cartInfo) {
        double total = 0;
        int quantity = 0;

        for (CartLineInfo line : cartInfo.getCartLines()) {
            total += line.getAmount();
            quantity += line.getQuantity();
        }

        cartInfo.setTotalAmount(total);
        cartInfo.setTotalQuantity(quantity);
    }
}
