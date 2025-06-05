package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.security.access.prepost.PreAuthorize;

import com.example.demo.entity.Account;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductForm;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.ProductRepository;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Controller
@Transactional
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Value("${admin.secret.key}")
    private String adminSecretKey;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String UPLOAD_DIR = "uploads/";

    // GET: Show Login Page
    @GetMapping("/login")
    @PreAuthorize("permitAll()")
    public String login(Model model) {
        return "login";
    }

    @GetMapping("/signup")
    @PreAuthorize("permitAll()")
    public String signup(Model model) {
        model.addAttribute("errorMessage", null);
        model.addAttribute("account", new Account());
        return "signup";
    }

    // POST: Save account
    @PostMapping("/account")
    @PreAuthorize("permitAll()")
    public String saveAccount(Model model,
                              @RequestParam("email") String email,
                              @RequestParam("password") String password,
                              @RequestParam("confirmPassword") String confirmPassword,
                              @RequestParam("firstName") String firstName,
                              @RequestParam("lastName") String lastName,
                              @RequestParam("phone") String phone,
                              @RequestParam("role") String role,
                              @RequestParam(value = "secretKey", required = false) String secretKey,
                              final RedirectAttributes redirectAttributes) {

        if (!password.equals(confirmPassword)) {
            model.addAttribute("errorMessage", "Passwords do not match");
            return "signup";
        }

        if (Account.ROLE_ADMIN.equals(role) && !adminSecretKey.equals(secretKey)) {
            model.addAttribute("errorMessage", "Invalid admin secret key");
            return "signup";
        }

        try {
            if (accountRepository.existsById(email)) {
                model.addAttribute("errorMessage", "Email already exists");
                return "signup";
            }

            Account account = new Account();
            account.setEmail(email);
            account.setPassword(passwordEncoder.encode(password));
            account.setFirstName(firstName);
            account.setLastName(lastName);
            account.setPhone(phone);
            account.setRole(role);
            account.setActive(true);

            accountRepository.save(account);

            redirectAttributes.addFlashAttribute("successMessage", "Account created successfully! Please login.");
            return "redirect:/admin/login";
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "signup";
        }
    }

    // POST: Validate secret key
    @PostMapping("/validate-secret-key")
    @ResponseBody
    @PreAuthorize("permitAll()")
    public ResponseEntity<Map<String, Boolean>> validateSecretKey(@RequestBody Map<String, String> request) {
        String secretKey = request.get("secretKey");
        Map<String, Boolean> response = new HashMap<>();
        boolean isValid = adminSecretKey.equals(secretKey);
        response.put("valid", isValid);
        return ResponseEntity.ok(response);
    }

    // GET: Show product.
    @GetMapping("/product")
    public String product(Model model, @RequestParam(value = "code", defaultValue = "") String code) {
        ProductForm productForm = null;

        if (code != null && !code.isEmpty()) {
            Product product = productRepository.findById(code).orElse(null);
            if (product != null) {
                productForm = new ProductForm(product);
            }
        }
        if (productForm == null) {
            productForm = new ProductForm();
            productForm.setNewProduct(true);
        }
        model.addAttribute("productForm", productForm);
        return "product";
    }

    // POST: Save product
    @PostMapping("/product")
    public String productSave(Model model,
                              @ModelAttribute("productForm") @Validated ProductForm productForm,
                              BindingResult result,
                              final RedirectAttributes redirectAttributes) {

        if (result.hasErrors()) {
            return "product";
        }

        try {
            Product product = new Product();

            if (productForm.isNewProduct()) {
                product.setCode(generateProductCode());
            } else {
                product.setCode(productForm.getCode());
            }

            product.setName(productForm.getName());
            product.setPrice(productForm.getPrice());
            product.setType(Product.PetType.valueOf(productForm.getType()));
            product.setBreed(productForm.getBreed());
            product.setAge(productForm.getAge());
            product.setGender(productForm.getGender());
            product.setDescription(productForm.getDescription());
            product.setStatus(productForm.getStatus());
            product.setCreateDate(new Date());

            MultipartFile fileData = productForm.getFileData();
            if (fileData != null && !fileData.isEmpty()) {
                String fileName = saveFile(fileData);
                product.setImagePath("/" + UPLOAD_DIR + fileName);
            } else if (!productForm.isNewProduct()) {
                // Preserve existing imagePath if no new file uploaded
                Product existingProduct = productRepository.findById(productForm.getCode()).orElse(null);
                if (existingProduct != null) {
                    product.setImagePath(existingProduct.getImagePath());
                }
            }

            productRepository.save(product);
            redirectAttributes.addFlashAttribute("successMessage", "Product saved successfully!");
            return "redirect:/productList";
        } catch (Exception e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "product";
        }
    }

    // POST: Delete product
    @PostMapping("/product/delete")
    public String productDelete(@RequestParam("code") String code, final RedirectAttributes redirectAttributes) {
        try {
            productRepository.deleteById(code);
            redirectAttributes.addFlashAttribute("successMessage", "Product deleted successfully!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/productList";
    }

    private String saveFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            originalFilename = "unknown_" + System.currentTimeMillis();
        }
        // Optionally, generate a unique filename to avoid collisions
        String filename = System.currentTimeMillis() + "_" + originalFilename;

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
}
