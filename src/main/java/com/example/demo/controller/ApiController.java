package com.example.demo.controller;

import com.example.demo.dao.ProductDAO;
import com.example.demo.entity.Account;
import com.example.demo.entity.Product;
import com.example.demo.entity.Reservation;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.UserDetailsServiceImpl;
import com.example.demo.service.ReservationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ApiController {

    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);

    private static final String UPLOAD_DIR = "src/main/resources/static/product-images/";

    @Value("${admin.secret.key}")
    private String adminSecretKey;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductDAO productDAO;

    @Autowired
    private ReservationService reservationService;

    private static final String ADMIN_EMAIL = "admin@petmart.com";
    private static final String ADMIN_PASSWORD = "admin123";

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> registrationData) {
        try {
            String email = registrationData.get("email");
            String password = registrationData.get("password");
            String firstName = registrationData.get("firstName");
            String lastName = registrationData.get("lastName");
            String phone = registrationData.get("phone");
            String role = registrationData.get("role");
            String secretKey = registrationData.get("secretKey");

            // Validate required fields
            if (email == null || email.trim().isEmpty() ||
                password == null || password.trim().isEmpty() ||
                firstName == null || firstName.trim().isEmpty() ||
                lastName == null || lastName.trim().isEmpty() ||
                phone == null || phone.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("All fields are required");
            }

            // Check if email already exists
            if (userDetailsService.existsByEmail(email)) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Create new account
            Account newAccount = new Account();
            newAccount.setEmail(email);
            newAccount.setPassword(passwordEncoder.encode(password));
            newAccount.setFirstName(firstName);
            newAccount.setLastName(lastName);
            newAccount.setPhone(phone);
            
            // Set role based on secret key validation
            if ((role.equalsIgnoreCase("ADMIN") || role.equalsIgnoreCase("ROLE_ADMIN")) && adminSecretKey.equals(secretKey)) {
                newAccount.setRole(Account.ROLE_ADMIN);
            } else {
                newAccount.setRole(Account.ROLE_USER);
            }
            
            newAccount.setActive(true);

            userDetailsService.save(newAccount);

            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            logger.error("Registration error: ", e);
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        try {
            if (ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password)) {
                if (!userDetailsService.existsByEmail(ADMIN_EMAIL)) {
                    Account adminAccount = new Account();
                    adminAccount.setEmail(ADMIN_EMAIL);
                    adminAccount.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                    adminAccount.setFirstName("Admin");
                    adminAccount.setLastName("User");
                    adminAccount.setRole(Account.ROLE_ADMIN);
                    adminAccount.setActive(true);
                    userDetailsService.save(adminAccount);
                }
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            Account account = userDetailsService.findByEmail(email);

            Map<String, Object> response = new HashMap<>();
            response.put("email", account.getEmail());
            response.put("firstName", account.getFirstName());
            response.put("lastName", account.getLastName());
            response.put("role", account.getRole());

            logger.info("User authenticated successfully: {}", email);
            logger.debug("Authenticated user authorities: {}", authentication.getAuthorities());

            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException e) {
            logger.warn("User not found during authentication: {}", email);
            return ResponseEntity.badRequest().body("User not found");
        } catch (Exception e) {
            logger.error("Authentication error for user: {}", email, e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Authentication failed");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
                logger.debug("No authenticated user found.");
                return ResponseEntity.ok(null);
            }

            String email = authentication.getName();
            Account account = userDetailsService.findByEmail(email);

        Map<String, Object> response = new HashMap<>();
            response.put("email", account.getEmail());
            response.put("firstName", account.getFirstName());
            response.put("lastName", account.getLastName());
            response.put("role", account.getRole());

            logger.debug("Found user {} with role {}", email, account.getRole());

            return ResponseEntity.ok(response);
        } catch (UsernameNotFoundException e) {
            logger.warn("Authenticated user not found in database.");
            return ResponseEntity.ok(null);
        } catch (Exception e) {
            logger.error("Internal Server Error in getCurrentUser", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal Server Error");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/reservations/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserReservations() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
                 return ResponseEntity.status(401).body("User not authenticated");
            }

            String userEmail = authentication.getName();

            List<Reservation> userReservations = reservationService.getReservationsByCustomerEmail(userEmail);

            logger.debug("Found {} reservations for user {}", userReservations.size(), userEmail);

            return ResponseEntity.ok(userReservations);

        } catch (Exception e) {
            logger.error("Error fetching user reservations", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch user reservations");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/reservations/me/active")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserActiveReservations() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
                 return ResponseEntity.status(401).body("User not authenticated");
            }

            String userEmail = authentication.getName();

            List<Reservation> userReservations = reservationService.getReservationsByCustomerEmail(userEmail);
            
            // Filter out ACCEPTED and REJECTED reservations
            List<Reservation> activeReservations = userReservations.stream()
                .filter(reservation -> reservation.getStatus() == Reservation.ReservationStatus.PENDING)
                .collect(Collectors.toList());

            logger.debug("Found {} active reservations for user {}", activeReservations.size(), userEmail);

            return ResponseEntity.ok(activeReservations);

        } catch (Exception e) {
            logger.error("Error fetching user active reservations", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch user active reservations");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @DeleteMapping("/reservations/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> withdrawReservation(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();

            Reservation reservation = reservationService.getReservationById(id);
            
            // Check if the reservation belongs to the current user
            if (!reservation.getCustomerEmail().equals(userEmail)) {
                return ResponseEntity.status(403).body("You are not authorized to withdraw this reservation");
            }

            // Check if the reservation is in PENDING status
            if (reservation.getStatus() != Reservation.ReservationStatus.PENDING) {
                return ResponseEntity.badRequest().body("Only pending reservations can be withdrawn");
            }

            // Delete the reservation
            reservationService.deleteReservation(id);

            return ResponseEntity.ok().body("Reservation withdrawn successfully");
        } catch (Exception e) {
            logger.error("Error withdrawing reservation", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to withdraw reservation");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @DeleteMapping("/reservations/clear")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> clearCompletedReservations() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();

            List<Reservation> userReservations = reservationService.getReservationsByCustomerEmail(userEmail);
            
            // Filter and delete only ACCEPTED and REJECTED reservations
            userReservations.stream()
                .filter(reservation -> 
                    reservation.getStatus() == Reservation.ReservationStatus.ACCEPTED || 
                    reservation.getStatus() == Reservation.ReservationStatus.REJECTED)
                .forEach(reservation -> reservationService.deleteReservation(reservation.getId()));

            return ResponseEntity.ok().body("Completed reservations cleared successfully");
        } catch (Exception e) {
            logger.error("Error clearing completed reservations", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to clear completed reservations");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/products")
    public ResponseEntity<?> getProducts(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "100") int size,
            @RequestParam(value = "searchTerm", defaultValue = "") String searchTerm) {
        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by("createDate").descending());
            Page<?> productPage;

            if (searchTerm == null || searchTerm.isEmpty()) {
                productPage = productDAO.queryProducts(pageable);
        } else {
                productPage = productDAO.queryProducts(pageable, searchTerm);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("items", productPage.getContent());
            response.put("currentPage", productPage.getNumber());
            response.put("totalItems", productPage.getTotalElements());
            response.put("totalPages", productPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error fetching products: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch products");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/admin/product")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("type") String type,
            @RequestParam("breed") String breed,
            @RequestParam("age") String age,
            @RequestParam("gender") String gender,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("status") String status,
            @RequestParam(value = "fileData", required = false) MultipartFile fileData) {
        try {
            logger.debug("Attempting to add product.");

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            logger.debug("Authentication principal: {}", authentication.getPrincipal());
            logger.debug("Authentication authorities: {}", authentication.getAuthorities());

            Product product = new Product();
            product.setCode(generateProductCode());
            product.setName(name);
            product.setType(Product.PetType.valueOf(type));
            product.setBreed(breed);
            product.setAge(age);
            product.setGender(gender);
            product.setDescription(description);
            product.setPrice(price);
            product.setStatus(status);
            product.setCreateDate(new Date());

            if (fileData != null && !fileData.isEmpty()) {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = product.getCode() + "_" + System.currentTimeMillis() + getFileExtension(fileData.getOriginalFilename());
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(fileData.getInputStream(), filePath);

                product.setImagePath("/product-images/" + fileName);
            }

            productRepository.save(product);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product added successfully");
            response.put("product", product);
            logger.info("Product added successfully: {}", product.getName());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to add product: {}", e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to add product");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PutMapping("/admin/product/{code}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateProduct(
            @PathVariable("code") String code,
            @RequestParam("name") String name,
            @RequestParam("type") String type,
            @RequestParam("breed") String breed,
            @RequestParam("age") String age,
            @RequestParam("gender") String gender,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("status") String status,
            @RequestParam(value = "fileData", required = false) MultipartFile fileData) {
        try {
            logger.debug("Attempting to update product with code: {}", code);

            Product existingProduct = productRepository.findById(code)
                    .orElseThrow(() -> new RuntimeException("Product not found with code: " + code));

            existingProduct.setName(name);
            existingProduct.setType(Product.PetType.valueOf(type));
            existingProduct.setBreed(breed);
            existingProduct.setAge(age);
            existingProduct.setGender(gender);
            existingProduct.setDescription(description);
            existingProduct.setPrice(price);
            // Allow status to be updated to any value by admin
            existingProduct.setStatus(status);
            // Preserve createDate

            if (fileData != null && !fileData.isEmpty()) {
                // Delete old image if exists
                if (existingProduct.getImagePath() != null) {
                    try {
                        Path oldImagePath = Paths.get(UPLOAD_DIR, existingProduct.getImagePath().substring(existingProduct.getImagePath().lastIndexOf("/") + 1));
                        Files.deleteIfExists(oldImagePath);
                    } catch (IOException e) {
                        logger.warn("Failed to delete old product image for code {}: {}", code, e.getMessage());
                    }
                }
                // Save new image
                String fileName = saveFile(fileData, code);
                existingProduct.setImagePath("/product-images/" + fileName);
            } else if (existingProduct.getImagePath() == null) {
                 // If no new file and no existing image, maybe set a default or handle as error?
                 // For now, just ensure imagePath is not set if no file is provided and no old one exists
                 existingProduct.setImagePath(null); // Or a default placeholder path
            }

            productRepository.save(existingProduct);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product updated successfully");
            response.put("product", existingProduct);
            logger.info("Product updated successfully: {}", existingProduct.getName());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Failed to update product with code {}: {}", code, e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update product");
            error.put("message", e.getMessage());
            return ResponseEntity.status(400).body(error); // Use 400 for bad request/not found
        } catch (Exception e) {
            logger.error("An unexpected error occurred while updating product with code {}: {}", code, e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal Server Error");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    private String saveFile(MultipartFile file, String productCode) throws IOException {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = productCode + "_unknown";
        }
        // Generate a unique filename using product code and timestamp
        String fileExtension = getFileExtension(originalFilename);
        String filename = productCode + "_" + System.currentTimeMillis() + (fileExtension.isEmpty() ? "" : "." + fileExtension);

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        try (InputStream inputStream = file.getInputStream()) {
            Path filePath = uploadPath.resolve(filename);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        }

        return filename;
    }

    private String generateProductCode() {
        Random random = new Random();
        String code;
        do {
            code = "P" + String.format("%03d", random.nextInt(1000));
        } while (productRepository.existsById(code));
        return code;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int lastDotIndex = fileName.lastIndexOf(".");
        return lastDotIndex == -1 ? "" : fileName.substring(lastDotIndex);
    }

    @PostMapping("/signout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Invalidate the session
        request.getSession().invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }

    @DeleteMapping("/admin/product/{code}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable("code") String code) {
        try {
            logger.debug("Attempting to delete product with code: {}", code);
            
            Product product = productRepository.findById(code)
                    .orElseThrow(() -> new RuntimeException("Product not found with code: " + code));

            // Delete the image file if it exists
            if (product.getImagePath() != null) {
                try {
                    String fileName = product.getImagePath().substring(product.getImagePath().lastIndexOf("/") + 1);
                    Path filePath = Paths.get(UPLOAD_DIR, fileName);
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    logger.warn("Failed to delete product image for code {}: {}", code, e.getMessage());
                }
            }

            productRepository.deleteById(code);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Product deleted successfully");
            logger.info("Product deleted successfully: {}", code);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Failed to delete product with code {}: {}", code, e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete product");
            error.put("message", e.getMessage());
            return ResponseEntity.status(400).body(error);
        } catch (Exception e) {
            logger.error("An unexpected error occurred while deleting product with code {}: {}", code, e.getMessage(), e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal Server Error");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
