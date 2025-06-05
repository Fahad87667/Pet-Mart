package com.example.demo.service;

import java.util.Collections;

import com.example.demo.entity.Account;
import com.example.demo.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Autowired
    private AccountRepository accountRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Loading user by email: {}", email);
        Account account = accountRepository.findById(email)
                .orElseThrow(() -> {
                    logger.warn("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        logger.debug("User found: {} with role: {}", account.getEmail(), account.getRole());

        // Use the role directly from the account
        String role = account.getRole();
        logger.debug("Setting role: {}", role);

        return new org.springframework.security.core.userdetails.User(
                account.getEmail(),
                account.getPassword(),
                account.isActive(),
                true, true, true,
                Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }

    public boolean existsByEmail(String email) {
        logger.debug("Checking if user exists with email: {}", email);
        return accountRepository.existsById(email);
    }

    public Account save(Account account) {
        logger.debug("Saving account: {} with role: {}", account.getEmail(), account.getRole());
        return accountRepository.save(account);
    }

    public Account findByEmail(String email) {
        logger.debug("Finding account by email: {}", email);
        return accountRepository.findById(email)
                .orElseThrow(() -> {
                    logger.warn("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });
    }
}
