package com.example.demo.service;

import com.example.demo.entity.Contact;
import java.util.List;

public interface ContactService {
    Contact saveContact(Contact contact);
    List<Contact> getAllContacts();
} 