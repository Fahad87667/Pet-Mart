package com.example.demo.dao;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import com.example.demo.entity.Product;
import com.example.demo.entity.ProductForm;
import com.example.demo.model.ProductInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.example.demo.entity.OrderDetail;
import java.util.List;

@Transactional
@Repository
public class ProductDAO {

    @PersistenceContext
    private EntityManager entityManager;

    private static final String UPLOAD_DIR = "src/main/resources/static/product-images/";

    public Product findProduct(String code) {
        try {
            String sql = "Select p from " + Product.class.getName() + " p Where p.code =:code ";
            Query query = entityManager.createQuery(sql);
            query.setParameter("code", code);
            return (Product) query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public ProductInfo findProductInfo(String code) {
        Product product = this.findProduct(code);
        return product != null ? new ProductInfo(product) : null;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = Exception.class)
    public void save(ProductForm productForm) {
        String code = productForm.getCode();
        Product product = this.findProduct(code);
        boolean isNew = false;

        if (product == null) {
            product = new Product();
            product.setCreateDate(new Date());
            isNew = true;
        }

        product.setCode(code);
        product.setName(productForm.getName());
        product.setPrice(productForm.getPrice());
        product.setType(Product.PetType.valueOf(productForm.getType()));
        product.setBreed(productForm.getBreed());
        product.setAge(productForm.getAge());
        product.setGender(productForm.getGender());
        product.setDescription(productForm.getDescription());
        product.setStatus(productForm.getStatus());

        if (productForm.getFileData() != null && !productForm.getFileData().isEmpty()) {
            try {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String fileName = code + "_" + System.currentTimeMillis() + getFileExtension(productForm.getFileData().getOriginalFilename());
                Path filePath = uploadPath.resolve(fileName);

                Files.copy(productForm.getFileData().getInputStream(), filePath);

                product.setImagePath("/product-images/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save product image: " + e.getMessage(), e);
            }
        }

        if (isNew) {
            entityManager.persist(product);
        } else {
            entityManager.merge(product);
        }
        entityManager.flush();
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = Exception.class)
    public void delete(ProductForm productForm) {
        String code = productForm.getCode();
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Product code cannot be null or empty");
        }
        
        Product product = this.findProduct(code);
        if (product == null) {
            throw new IllegalArgumentException("No product found with code: " + code);
        }
        
            // Check if product is in any orders
        String checkOrderSql = "Select count(od) from " + OrderDetail.class.getName() + " od Where od.productCode =:code";
            Query checkOrderQuery = entityManager.createQuery(checkOrderSql);
            checkOrderQuery.setParameter("code", code);
            Long orderCount = (Long) checkOrderQuery.getSingleResult();
            
            if (orderCount > 0) {
                throw new RuntimeException("Cannot delete product because it is associated with existing orders.");
            }
            
            // Delete image file if exists
            if (product.getImagePath() != null) {
                try {
                    String fileName = product.getImagePath().substring(product.getImagePath().lastIndexOf("/") + 1);
                    Path filePath = Paths.get(UPLOAD_DIR, fileName);
                Files.deleteIfExists(filePath);
                } catch (IOException e) {
                throw new RuntimeException("Failed to delete product image: " + e.getMessage(), e);
                }
            }
            
                entityManager.remove(product);
                entityManager.flush();
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) return "";
        int lastDotIndex = fileName.lastIndexOf(".");
        return lastDotIndex == -1 ? "" : fileName.substring(lastDotIndex);
    }

    public Page<ProductInfo> queryProducts(Pageable pageable, String likeName) {
        String baseSelect = "Select p from " + Product.class.getName() + " p";
        String baseCount = "Select count(p) from " + Product.class.getName() + " p";
        
        if (likeName != null && !likeName.trim().isEmpty()) {
            baseSelect += " Where lower(p.name) like :likeName";
            baseCount += " Where lower(p.name) like :likeName";
        }

        baseSelect += " order by p.createDate desc";
        
        Query query = entityManager.createQuery(baseSelect);
        Query countQuery = entityManager.createQuery(baseCount);
        
        if (likeName != null && !likeName.trim().isEmpty()) {
            String likeValue = "%" + likeName.toLowerCase() + "%";
            query.setParameter("likeName", likeValue);
            countQuery.setParameter("likeName", likeValue);
        }
        
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        
        List<Product> products = query.getResultList();
        List<ProductInfo> content = products.stream().map(ProductInfo::new).toList();
        Long total = (Long) countQuery.getSingleResult();

        return new PageImpl<>(content, pageable, total);
    }
    
    public Page<ProductInfo> queryProducts(Pageable pageable) {
        return queryProducts(pageable, null);
    }
}
