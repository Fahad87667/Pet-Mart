package com.example.demo.controller;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import com.example.demo.entity.Order;
import com.example.demo.entity.OrderDetail;
import com.example.demo.entity.Product;
import com.example.demo.entity.Customer;
import com.example.demo.model.CartInfo;
import com.example.demo.model.CartLineInfo;
import com.example.demo.model.CustomerInfo;
import com.example.demo.model.ProductInfo;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@Transactional
public class MainController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartService cartService;

    @RequestMapping("/")
    public String home() {
        return "index";
    }

    @RequestMapping("/about")
    public String about() {
        return "about";
    }

    @RequestMapping({ "/productList" })
    public String listProductHandler(Model model,
                                     @RequestParam(value = "name", defaultValue = "") String likeName,
                                     @RequestParam(value = "page", defaultValue = "1") int page) {
        final int maxResult = 100;
        Pageable pageable = PageRequest.of(page - 1, maxResult);
        Page<Product> products = productRepository.findAll(pageable);

        model.addAttribute("listProducts", products);
        return "productList";
    }

    @RequestMapping({ "/buyProduct" })
    public String buyProductHandler(HttpServletRequest request, Model model,
                                    @RequestParam(value = "code", defaultValue = "") String code) {
        Product product = null;
        if (code != null && !code.isEmpty()) {
            product = productRepository.findById(code).orElse(null);
        }
        if (product != null) {
            CartInfo cartInfo = cartService.getCartInSession(request);
            ProductInfo productInfo = new ProductInfo(product);
            cartInfo.addProduct(productInfo, 1);
        }
        return "redirect:/shoppingCart";
    }

    @RequestMapping({ "/shoppingCartRemoveProduct" })
    public String removeProductHandler(HttpServletRequest request, Model model,
                                       @RequestParam(value = "code", defaultValue = "") String code) {
        Product product = null;
        if (code != null && !code.isEmpty()) {
            product = productRepository.findById(code).orElse(null);
        }
        if (product != null) {
            CartInfo cartInfo = cartService.getCartInSession(request);
            ProductInfo productInfo = new ProductInfo(product);
            cartInfo.removeProduct(productInfo);
        }
        return "redirect:/shoppingCart";
    }

    @RequestMapping(value = { "/shoppingCart" }, method = RequestMethod.POST)
    public String shoppingCartUpdateQty(HttpServletRequest request,
                                        Model model,
                                        @ModelAttribute("cartForm") CartInfo cartForm) {
        CartInfo cartInfo = cartService.getCartInSession(request);
        cartInfo.updateQuantity(cartForm);
        return "redirect:/shoppingCart";
    }

    @RequestMapping(value = { "/shoppingCart" }, method = RequestMethod.GET)
    public String shoppingCartHandler(HttpServletRequest request, Model model) {
        CartInfo myCart = cartService.getCartInSession(request);
        model.addAttribute("cartForm", myCart);
        return "shoppingCart";
    }

    @RequestMapping(value = { "/shoppingCartCustomer" }, method = RequestMethod.GET)
    public String shoppingCartCustomerForm(HttpServletRequest request, Model model) {
        CartInfo cartInfo = cartService.getCartInSession(request);
        if (cartInfo.isEmpty()) {
            return "redirect:/shoppingCart";
        }
        CustomerInfo customerInfo = cartInfo.getCustomerInfo();
        Customer customer = new Customer(customerInfo);
        model.addAttribute("customerForm", customer);
        return "shoppingCartCustomer";
    }

    @RequestMapping(value = { "/shoppingCartCustomer" }, method = RequestMethod.POST)
    public String shoppingCartCustomerSave(HttpServletRequest request,
                                           Model model,
                                           @ModelAttribute("customerForm") @Valid Customer customer,
                                           BindingResult result,
                                           final RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            customer.setValid(false);
            return "shoppingCartCustomer";
        }

        customer.setValid(true);
        CartInfo cartInfo = cartService.getCartInSession(request);
        cartInfo.setCustomerInfo(new CustomerInfo(customer));

        return "redirect:/shoppingCartConfirmation";
    }

    @RequestMapping(value = { "/shoppingCartConfirmation" }, method = RequestMethod.GET)
    public String shoppingCartConfirmationReview(HttpServletRequest request, Model model) {
        CartInfo cartInfo = cartService.getCartInSession(request);
        if (cartInfo.isEmpty()) {
            return "redirect:/shoppingCart";
        } else if (!cartInfo.isValidCustomer()) {
            return "redirect:/shoppingCartCustomer";
        }
        model.addAttribute("cartInfo", cartInfo);
        return "shoppingCartConfirmation";
    }

    @RequestMapping(value = { "/shoppingCartConfirmation" }, method = RequestMethod.POST)
    public String shoppingCartConfirmationSave(HttpServletRequest request, Model model) {
        CartInfo cartInfo = cartService.getCartInSession(request);
        if (cartInfo.isEmpty()) {
            return "redirect:/shoppingCart";
        } else if (!cartInfo.isValidCustomer()) {
            return "redirect:/shoppingCartCustomer";
        }
        try {
            CustomerInfo customerInfo = cartInfo.getCustomerInfo();
            Order order = new Order();
            order.setOrderDate(new Date());
            order.setOrderNum(cartInfo.getOrderNum());
            order.setAmount(cartInfo.getAmountTotal());
            order.setCustomerName(customerInfo.getName());
            order.setCustomerAddress(customerInfo.getAddress());
            order.setCustomerEmail(customerInfo.getEmail());
            order.setCustomerPhone(customerInfo.getPhone());

            Set<OrderDetail> orderDetails = new HashSet<>();
            for (CartLineInfo line : cartInfo.getCartLines()) {
                ProductInfo productInfo = line.getProductInfo();
                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setOrder(order);
                orderDetail.setProductCode(productInfo.getCode());
                orderDetail.setProductName(productInfo.getName());
                orderDetail.setQuanity(line.getQuantity());
                orderDetail.setPrice(productInfo.getPrice());
                orderDetail.setAmount(line.getAmount());
                orderDetails.add(orderDetail);
            }
            order.setOrderDetails(orderDetails);
            orderRepository.save(order);
        } catch (Exception e) {
            return "shoppingCartConfirmation";
        }

        cartService.removeCartInSession(request);
        cartService.storeLastOrderedCartInSession(request, cartInfo);
        return "redirect:/shoppingCartFinalize";
    }

    @RequestMapping(value = { "/shoppingCartFinalize" }, method = RequestMethod.GET)
    public String shoppingCartFinalize(HttpServletRequest request, Model model) {
        CartInfo lastOrderedCart = cartService.getLastOrderedCartInSession(request);
        if (lastOrderedCart == null) {
            return "redirect:/shoppingCart";
        }
        model.addAttribute("lastOrderedCart", lastOrderedCart);
        return "shoppingCartFinalize";
    }

    // Removed `/productImage` handler — no longer needed with imagePath usage
}
