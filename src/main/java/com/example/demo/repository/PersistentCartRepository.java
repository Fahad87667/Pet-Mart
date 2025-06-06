package com.example.demo.repository;

import com.example.demo.entity.PersistentCart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PersistentCartRepository extends JpaRepository<PersistentCart, Long> {
    Optional<PersistentCart> findByUserId(String userId);
    void deleteByUserId(String userId);
} 