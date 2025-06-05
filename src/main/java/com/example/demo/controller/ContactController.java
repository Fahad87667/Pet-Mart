package com.example.demo.controller;

import com.example.demo.entity.Contact;
import com.example.demo.service.ContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private ContactService contactService;

    @PostMapping("/contact")
    public ResponseEntity<?> handleContactForm(@RequestBody Map<String, String> contactData) {
        try {
            logger.debug("Received contact form submission");

            // Validate required fields
            if (contactData.get("name") == null || contactData.get("name").trim().isEmpty() ||
                contactData.get("email") == null || contactData.get("email").trim().isEmpty() ||
                contactData.get("phone") == null || contactData.get("phone").trim().isEmpty() ||
                contactData.get("subject") == null || contactData.get("subject").trim().isEmpty() ||
                contactData.get("message") == null || contactData.get("message").trim().isEmpty()) {
                return ResponseEntity.badRequest().body("All fields are required");
            }

            Contact contact = new Contact();
            contact.setName(contactData.get("name"));
            contact.setEmail(contactData.get("email"));
            contact.setPhone(contactData.get("phone"));
            contact.setSubject(contactData.get("subject"));
            contact.setMessage(contactData.get("message"));

            contactService.saveContact(contact);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Thank you for your message! We'll get back to you soon.");
            response.put("success", true);

            logger.info("Contact form submitted successfully for: {}", contact.getEmail());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error processing contact form submission: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Sorry, there was an error sending your message. Please try again later.");
            error.put("success", false);
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/admin/contacts")
    public ResponseEntity<?> getAllContacts() {
        try {
            return ResponseEntity.ok(contactService.getAllContacts());
        } catch (Exception e) {
            logger.error("Error fetching contacts: ", e);
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch contacts");
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
} 