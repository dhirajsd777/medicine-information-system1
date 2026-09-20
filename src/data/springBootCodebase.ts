import { CodeFile } from '../types/pharmacy';

export const SPRING_BOOT_PROJECT_FILES: CodeFile[] = [
  {
    path: 'pom.xml',
    filename: 'pom.xml',
    language: 'xml',
    category: 'Configuration',
    description: 'Maven build configuration with Spring Boot 3.3.x, Spring Web, Data JPA, Security 6, Thymeleaf, and H2/MySQL drivers',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.pharmacy</groupId>
    <artifactId>medicine-management-system</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>medicine-management-system</name>
    <description>Enterprise Medicine Information and Inventory Management System</description>

    <properties>
        <java.version>17</java.version>
        <bootstrap.version>5.3.3</bootstrap.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web MVC for REST & Thymeleaf Controllers -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA with Hibernate ORM -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring Security 6 for Role-Based Access Control -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Thymeleaf Template Engine & Security Dialect -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.thymeleaf.extras</groupId>
            <artifactId>thymeleaf-extras-springsecurity6</artifactId>
        </dependency>

        <!-- Bean Validation (JSR-380 / Hibernate Validator) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- In-Memory H2 Database for Rapid Dev/Testing -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Production MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok for clean boilerplate elimination -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- DevTools for Hot Reload in Local Environment -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Testing Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'src/main/resources/application.properties',
    filename: 'application.properties',
    language: 'properties',
    category: 'Configuration',
    description: 'Spring Boot configuration with dual H2/MySQL profiles, JPA dialect, and file upload limits',
    content: `# Application Metadata
spring.application.name=Medicine Information & Management System
server.port=8080

# Active Profile: dev (H2 Database) or prod (MySQL)
spring.profiles.active=dev

# In-Memory H2 Database Configuration (Dev)
spring.datasource.url=jdbc:h2:mem:pharmacydb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Hibernate JPA Settings
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Thymeleaf Cache (disable in dev for instant live reload)
spring.thymeleaf.cache=false
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html

# Multipart File Upload (Prescription scans & PDFs)
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Custom Pharmacy Business Rules
pharmacy.inventory.low-stock-threshold=10
pharmacy.inventory.critical-stock-threshold=0
pharmacy.prescription.upload-dir=./uploads/prescriptions/`
  },
  {
    path: 'src/main/java/com/pharmacy/entity/User.java',
    filename: 'User.java',
    language: 'java',
    category: 'Entities',
    description: 'JPA User Entity with Role-based access control, credentials, and relationship mappings',
    content: `package com.pharmacy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role; // ROLE_CUSTOMER, ROLE_ADMIN

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 20)
    private String phone;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Prescription> prescriptions = new ArrayList<>();
}`
  },
  {
    path: 'src/main/java/com/pharmacy/entity/Role.java',
    filename: 'Role.java',
    language: 'java',
    category: 'Entities',
    description: 'Enum defining standard Spring Security GrantedAuthorities',
    content: `package com.pharmacy.entity;

public enum Role {
    ROLE_CUSTOMER,
    ROLE_ADMIN
}`
  },
  {
    path: 'src/main/java/com/pharmacy/entity/Medicine.java',
    filename: 'Medicine.java',
    language: 'java',
    category: 'Entities',
    description: 'JPA Medicine Entity with stock counter, medical info, and stock validation methods',
    content: `package com.pharmacy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "medicines")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Medicine name is required")
    @Column(nullable = false, length = 150)
    private String name;

    @NotBlank(message = "Generic name is required")
    @Column(nullable = false, length = 150)
    private String genericName;

    @NotBlank(message = "Category is required")
    @Column(nullable = false, length = 80)
    private String category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    @Column(nullable = false)
    private Double price;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    @Column(nullable = false)
    private Integer stock;

    @NotNull(message = "Expiry date is required")
    @Column(nullable = false)
    private LocalDate expiryDate;

    @Column(columnDefinition = "TEXT")
    private String uses;

    @Column(columnDefinition = "TEXT")
    private String dosageInfo;

    @Column(columnDefinition = "TEXT")
    private String sideEffects;

    @Column(nullable = false)
    @Builder.Default
    private Boolean requiresPrescription = false;

    // Business Logic Helper
    public boolean isLowStock() {
        return this.stock > 0 && this.stock < 10;
    }

    public boolean isOutOfStock() {
        return this.stock == 0;
    }

    public boolean isExpired() {
        return this.expiryDate != null && this.expiryDate.isBefore(LocalDate.now());
    }
}`
  },
  {
    path: 'src/main/java/com/pharmacy/entity/Prescription.java',
    filename: 'Prescription.java',
    language: 'java',
    category: 'Entities',
    description: 'JPA Prescription Entity tracking customer uploads, verification status, and notes',
    content: `package com.pharmacy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "Doctor name is required")
    @Column(nullable = false, length = 100)
    private String doctorName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PrescriptionStatus status = PrescriptionStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String dosage;

    @NotNull(message = "Prescription date is required")
    @Column(nullable = false)
    private LocalDate date;

    @NotBlank(message = "Prescription document is required")
    @Column(nullable = false)
    private String filePath;

    @Column(length = 150)
    private String medicineName;

    @Column(columnDefinition = "TEXT")
    private String pharmacistRemarks;
}`
  },
  {
    path: 'src/main/java/com/pharmacy/entity/PrescriptionStatus.java',
    filename: 'PrescriptionStatus.java',
    language: 'java',
    category: 'Entities',
    description: 'Enum for Prescription lifecycle verification',
    content: `package com.pharmacy.entity;

public enum PrescriptionStatus {
    PENDING,
    APPROVED,
    REJECTED
}`
  },
  {
    path: 'src/main/java/com/pharmacy/entity/Order.java',
    filename: 'Order.java',
    language: 'java',
    category: 'Entities',
    description: 'JPA Order Entity with order status, payment ID, and one-to-many items',
    content: `package com.pharmacy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OrderStatus status = OrderStatus.PLACED;

    @Column(length = 60)
    private String paymentId;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(columnDefinition = "TEXT", nullable = false)
    private String shippingAddress;

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}`
  },
  {
    path: 'src/main/java/com/pharmacy/entity/OrderItem.java',
    filename: 'OrderItem.java',
    language: 'java',
    category: 'Entities',
    description: 'JPA OrderItem linking orders with medicines, capturing purchase-time price snapshot',
    content: `package com.pharmacy.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double price; // Price at the time of order placement
}`
  },
  {
    path: 'src/main/java/com/pharmacy/entity/OrderStatus.java',
    filename: 'OrderStatus.java',
    language: 'java',
    category: 'Entities',
    description: 'Enum tracking Order shipping pipeline stages',
    content: `package com.pharmacy.entity;

public enum OrderStatus {
    PLACED,
    PROCESSING,
    SHIPPED,
    DELIVERED
}`
  },
  {
    path: 'src/main/java/com/pharmacy/entity/Review.java',
    filename: 'Review.java',
    language: 'java',
    category: 'Entities',
    description: 'JPA Review Entity for patient feedback and medicine ratings',
    content: `package com.pharmacy.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @NotNull
    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    @Builder.Default
    private LocalDate reviewDate = LocalDate.now();
}`
  },
  {
    path: 'src/main/java/com/pharmacy/repository/MedicineRepository.java',
    filename: 'MedicineRepository.java',
    language: 'java',
    category: 'Repositories',
    description: 'Spring Data JPA Repository for Medicine with stock alert queries',
    content: `package com.pharmacy.repository;

import com.pharmacy.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByNameContainingIgnoreCaseOrGenericNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            String name, String genericName, String category);

    List<Medicine> findByCategory(String category);

    // Alert queries: Low Stock (< 10) and Critical Empty Stock (== 0)
    List<Medicine> findByStockLessThan(Integer threshold);

    List<Medicine> findByStock(Integer stock);

    @Query("SELECT m FROM Medicine m WHERE m.stock > 0 AND m.stock < :threshold ORDER BY m.stock ASC")
    List<Medicine> findLowStockMedicines(@Param("threshold") Integer threshold);

    @Query("SELECT m FROM Medicine m WHERE m.stock = 0 ORDER BY m.name ASC")
    List<Medicine> findOutOfStockMedicines();

    Long countByStockLessThan(Integer threshold);

    Long countByStock(Integer stock);
}`
  },
  {
    path: 'src/main/java/com/pharmacy/repository/UserRepository.java',
    filename: 'UserRepository.java',
    language: 'java',
    category: 'Repositories',
    description: 'Spring Data JPA Repository for User lookup and authentication',
    content: `package com.pharmacy.repository;

import com.pharmacy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}`
  },
  {
    path: 'src/main/java/com/pharmacy/repository/OrderRepository.java',
    filename: 'OrderRepository.java',
    language: 'java',
    category: 'Repositories',
    description: 'Spring Data JPA Repository for Order history and analytics',
    content: `package com.pharmacy.repository;

import com.pharmacy.entity.Order;
import com.pharmacy.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
    List<Order> findAllByOrderByOrderDateDesc();
    Long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0.0) FROM Order o WHERE o.status <> 'CANCELLED'")
    Double calculateTotalRevenue();
}`
  },
  {
    path: 'src/main/java/com/pharmacy/repository/PrescriptionRepository.java',
    filename: 'PrescriptionRepository.java',
    language: 'java',
    category: 'Repositories',
    description: 'Spring Data JPA Repository for Prescriptions with status counters',
    content: `package com.pharmacy.repository;

import com.pharmacy.entity.Prescription;
import com.pharmacy.entity.PrescriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByUserIdOrderByDateDesc(Long userId);
    List<Prescription> findByStatusOrderByDateDesc(PrescriptionStatus status);
    Long countByStatus(PrescriptionStatus status);
}`
  },
  {
    path: 'src/main/java/com/pharmacy/service/MedicineService.java',
    filename: 'MedicineService.java',
    language: 'java',
    category: 'Services',
    description: 'Business Service handling CRUD, inventory replenishment, and low-stock / empty-stock alert logging',
    content: `package com.pharmacy.service;

import com.pharmacy.entity.Medicine;
import com.pharmacy.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private static final int LOW_STOCK_THRESHOLD = 10;

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Medicine getMedicineById(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found with id: " + id));
    }

    public List<Medicine> searchMedicines(String query) {
        if (query == null || query.trim().isEmpty()) {
            return medicineRepository.findAll();
        }
        return medicineRepository.findByNameContainingIgnoreCaseOrGenericNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                query, query, query);
    }

    public Medicine saveMedicine(Medicine medicine) {
        Medicine saved = medicineRepository.save(medicine);
        checkAndLogStockAlert(saved);
        return saved;
    }

    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    // Low stock alerts (< 10)
    public List<Medicine> getLowStockMedicines() {
        return medicineRepository.findLowStockMedicines(LOW_STOCK_THRESHOLD);
    }

    // Critical out of stock alerts (= 0)
    public List<Medicine> getOutOfStockMedicines() {
        return medicineRepository.findOutOfStockMedicines();
    }

    public Long countLowStockAlerts() {
        return medicineRepository.countByStockLessThan(LOW_STOCK_THRESHOLD);
    }

    public Long countOutOfStockAlerts() {
        return medicineRepository.countByStock(0);
    }

    // Restock Action
    public Medicine restock(Long id, int additionalUnits) {
        if (additionalUnits <= 0) {
            throw new IllegalArgumentException("Restock units must be greater than zero");
        }
        Medicine medicine = getMedicineById(id);
        int oldStock = medicine.getStock();
        medicine.setStock(oldStock + additionalUnits);
        log.info("RESTOCK EVENT: Medicine '{}' (ID: {}) restocked from {} to {} units",
                medicine.getName(), id, oldStock, medicine.getStock());
        return medicineRepository.save(medicine);
    }

    // Deduct stock upon order confirmation
    public void deductStock(Long medicineId, int quantity) {
        Medicine medicine = getMedicineById(medicineId);
        if (medicine.getStock() < quantity) {
            throw new IllegalStateException("Insufficient stock for medicine: " + medicine.getName() +
                    ". Available: " + medicine.getStock() + ", Requested: " + quantity);
        }
        medicine.setStock(medicine.getStock() - quantity);
        medicineRepository.save(medicine);
        checkAndLogStockAlert(medicine);
    }

    private void checkAndLogStockAlert(Medicine medicine) {
        if (medicine.getStock() == 0) {
            log.error("CRITICAL STOCK ALERT: Medicine '{}' (ID: {}) is completely OUT OF STOCK (0 units)!",
                    medicine.getName(), medicine.getId());
        } else if (medicine.getStock() < LOW_STOCK_THRESHOLD) {
            log.warn("LOW STOCK WARNING: Medicine '{}' (ID: {}) has only {} units left (Threshold < 10)!",
                    medicine.getName(), medicine.getId(), medicine.getStock());
        }
    }
}`
  },
  {
    path: 'src/main/java/com/pharmacy/service/OrderService.java',
    filename: 'OrderService.java',
    language: 'java',
    category: 'Services',
    description: 'Transactional Order placement with automatic stock reduction, validation, and status tracking',
    content: `package com.pharmacy.service;

import com.pharmacy.entity.*;
import com.pharmacy.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final MedicineService medicineService;

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID: " + id));
    }

    /**
     * Atomically place order and deduct inventory stock
     */
    public Order placeOrder(User user, Map<Long, Integer> cartItems, String shippingAddress) {
        if (cartItems == null || cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart cannot be empty when placing an order.");
        }

        Order order = Order.builder()
                .user(user)
                .shippingAddress(shippingAddress)
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PLACED)
                .paymentId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();

        double total = 0.0;

        for (Map.Entry<Long, Integer> entry : cartItems.entrySet()) {
            Long medId = entry.getKey();
            int qty = entry.getValue();
            Medicine medicine = medicineService.getMedicineById(medId);

            // Deduct stock (will throw exception if insufficient)
            medicineService.deductStock(medId, qty);

            OrderItem item = OrderItem.builder()
                    .medicine(medicine)
                    .quantity(qty)
                    .price(medicine.getPrice())
                    .build();

            order.addItem(item);
            total += (medicine.getPrice() * qty);
        }

        order.setTotalAmount(Math.round(total * 100.0) / 100.0);
        Order savedOrder = orderRepository.save(order);
        log.info("ORDER PLACED: Order ID #{} by user {} for amount \${}", savedOrder.getId(), user.getEmail(), savedOrder.getTotalAmount());
        return savedOrder;
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        log.info("ORDER STATUS UPDATED: Order #{} transitioned to {}", orderId, status);
        return orderRepository.save(order);
    }

    public Double getTotalRevenue() {
        return orderRepository.calculateTotalRevenue();
    }
}`
  },
  {
    path: 'src/main/java/com/pharmacy/service/PrescriptionService.java',
    filename: 'PrescriptionService.java',
    language: 'java',
    category: 'Services',
    description: 'Prescription upload handling and pharmacist verification workflow',
    content: `package com.pharmacy.service;

import com.pharmacy.entity.Prescription;
import com.pharmacy.entity.PrescriptionStatus;
import com.pharmacy.entity.User;
import com.pharmacy.repository.PrescriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;

    public List<Prescription> getPrescriptionsByUser(Long userId) {
        return prescriptionRepository.findByUserIdOrderByDateDesc(userId);
    }

    public List<Prescription> getAllPendingPrescriptions() {
        return prescriptionRepository.findByStatusOrderByDateDesc(PrescriptionStatus.PENDING);
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Prescription submitPrescription(User user, String doctorName, String dosage, String filePath, String medicineName) {
        Prescription rx = Prescription.builder()
                .user(user)
                .doctorName(doctorName)
                .dosage(dosage)
                .filePath(filePath)
                .medicineName(medicineName)
                .date(LocalDate.now())
                .status(PrescriptionStatus.PENDING)
                .build();
        return prescriptionRepository.save(rx);
    }

    public Prescription verifyPrescription(Long prescriptionId, PrescriptionStatus status, String remarks) {
        Prescription rx = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new IllegalArgumentException("Prescription not found with ID: " + prescriptionId));
        rx.setStatus(status);
        rx.setPharmacistRemarks(remarks);
        log.info("PRESCRIPTION VERIFIED: ID #{} marked as {} by pharmacist", prescriptionId, status);
        return prescriptionRepository.save(rx);
    }

    public Long countPendingPrescriptions() {
        return prescriptionRepository.countByStatus(PrescriptionStatus.PENDING);
    }
}`
  },
  {
    path: 'src/main/java/com/pharmacy/security/SecurityConfig.java',
    filename: 'SecurityConfig.java',
    language: 'java',
    category: 'Security',
    description: 'Spring Security 6 configuration segregating /customer/** and /admin/** route authorities with BCrypt',
    content: `package com.pharmacy.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                // Static assets & Public routes
                .requestMatchers("/", "/login", "/register", "/css/**", "/js/**", "/images/**", "/h2-console/**", "/api/public/**").permitAll()
                // Customer-exclusive routes
                .requestMatchers("/customer/**").hasRole("CUSTOMER")
                // Admin & Pharmacist routes
                .requestMatchers("/admin/**", "/api/admin/**").hasRole("ADMIN")
                // All other endpoints require basic authentication
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login-process")
                .defaultSuccessUrl("/default-landing", true)
                .failureUrl("/login?error=true")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login?logout=true")
                .deleteCookies("JSESSIONID")
                .invalidateHttpSession(true)
                .permitAll()
            )
            // Allow H2 in-memory console framing in development
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .csrf(csrf -> csrf.ignoringRequestMatchers("/h2-console/**", "/api/**"));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}`
  },
  {
    path: 'src/main/java/com/pharmacy/controller/CustomerController.java',
    filename: 'CustomerController.java',
    language: 'java',
    category: 'Controllers',
    description: 'Spring MVC Controller handling Catalog browsing, Cart, Checkout, Prescription uploads, and Order tracking',
    content: `package com.pharmacy.controller;

import com.pharmacy.entity.Medicine;
import com.pharmacy.entity.Order;
import com.pharmacy.entity.Prescription;
import com.pharmacy.entity.User;
import com.pharmacy.service.MedicineService;
import com.pharmacy.service.OrderService;
import com.pharmacy.service.PrescriptionService;
import com.pharmacy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final MedicineService medicineService;
    private final OrderService orderService;
    private final PrescriptionService prescriptionService;
    private final UserService userService;

    // Medicine Catalog with Search & Filter
    @GetMapping("/catalog")
    public String viewCatalog(@RequestParam(value = "search", required = false) String search,
                              @RequestParam(value = "category", required = false) String category,
                              Model model) {
        List<Medicine> medicines;
        if (search != null && !search.isBlank()) {
            medicines = medicineService.searchMedicines(search);
        } else {
            medicines = medicineService.getAllMedicines();
        }
        model.addAttribute("medicines", medicines);
        model.addAttribute("search", search);
        return "customer/catalog";
    }

    // Cart Management
    @PostMapping("/cart/add")
    public String addToCart(@RequestParam("medicineId") Long medicineId,
                            @RequestParam(value = "quantity", defaultValue = "1") int quantity,
                            HttpSession session, RedirectAttributes ra) {
        Map<Long, Integer> cart = (Map<Long, Integer>) session.getAttribute("cart");
        if (cart == null) {
            cart = new HashMap<>();
            session.setAttribute("cart", cart);
        }
        Medicine medicine = medicineService.getMedicineById(medicineId);
        int currentQtyInCart = cart.getOrDefault(medicineId, 0);
        if (currentQtyInCart + quantity > medicine.getStock()) {
            ra.addFlashAttribute("errorMsg", "Cannot add more. Only " + medicine.getStock() + " units available.");
            return "redirect:/customer/catalog";
        }
        cart.put(medicineId, currentQtyInCart + quantity);
        ra.addFlashAttribute("successMsg", medicine.getName() + " added to cart.");
        return "redirect:/customer/catalog";
    }

    // Checkout & Order Placement
    @PostMapping("/checkout")
    public String checkout(@RequestParam("address") String address,
                           @AuthenticationPrincipal UserDetails userDetails,
                           HttpSession session, RedirectAttributes ra) {
        Map<Long, Integer> cart = (Map<Long, Integer>) session.getAttribute("cart");
        if (cart == null || cart.isEmpty()) {
            ra.addFlashAttribute("errorMsg", "Cart is empty.");
            return "redirect:/customer/catalog";
        }
        User user = userService.getByEmail(userDetails.getUsername());
        Order order = orderService.placeOrder(user, cart, address);
        session.removeAttribute("cart");
        ra.addFlashAttribute("successMsg", "Order #" + order.getId() + " placed successfully!");
        return "redirect:/customer/orders";
    }

    // Order Tracking
    @GetMapping("/orders")
    public String trackOrders(@AuthenticationPrincipal UserDetails userDetails, Model model) {
        User user = userService.getByEmail(userDetails.getUsername());
        List<Order> orders = orderService.getOrdersByUser(user.getId());
        model.addAttribute("orders", orders);
        return "customer/orders";
    }

    // Prescription Submission
    @PostMapping("/prescriptions/upload")
    public String uploadPrescription(@RequestParam("doctorName") String doctorName,
                                     @RequestParam("dosage") String dosage,
                                     @RequestParam("medicineName") String medicineName,
                                     @RequestParam("file") MultipartFile file,
                                     @AuthenticationPrincipal UserDetails userDetails,
                                     RedirectAttributes ra) {
        User user = userService.getByEmail(userDetails.getUsername());
        String storedFilename = "rx-" + System.currentTimeMillis() + "-" + file.getOriginalFilename();
        prescriptionService.submitPrescription(user, doctorName, dosage, storedFilename, medicineName);
        ra.addFlashAttribute("successMsg", "Prescription submitted for pharmacist review.");
        return "redirect:/customer/prescriptions";
    }
}`
  },
  {
    path: 'src/main/java/com/pharmacy/controller/AdminController.java',
    filename: 'AdminController.java',
    language: 'java',
    category: 'Controllers',
    description: 'Admin/Pharmacist Controller managing executive dashboard, inventory CRUD, stock alerts, and prescription verification',
    content: `package com.pharmacy.controller;

import com.pharmacy.entity.Medicine;
import com.pharmacy.entity.OrderStatus;
import com.pharmacy.entity.PrescriptionStatus;
import com.pharmacy.service.MedicineService;
import com.pharmacy.service.OrderService;
import com.pharmacy.service.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final MedicineService medicineService;
    private final OrderService orderService;
    private final PrescriptionService prescriptionService;

    // Executive Metrics Dashboard
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("totalRevenue", orderService.getTotalRevenue());
        model.addAttribute("totalMedicines", medicineService.getAllMedicines().size());
        model.addAttribute("lowStockCount", medicineService.countLowStockAlerts());
        model.addAttribute("outOfStockCount", medicineService.countOutOfStockAlerts());
        model.addAttribute("pendingPrescriptions", prescriptionService.countPendingPrescriptions());
        model.addAttribute("recentOrders", orderService.getAllOrders());
        return "admin/dashboard";
    }

    // Inventory Stock List & Management
    @GetMapping("/inventory")
    public String inventoryList(@RequestParam(value = "filter", defaultValue = "ALL") String filter, Model model) {
        if ("LOW_STOCK".equals(filter)) {
            model.addAttribute("medicines", medicineService.getLowStockMedicines());
        } else if ("OUT_OF_STOCK".equals(filter)) {
            model.addAttribute("medicines", medicineService.getOutOfStockMedicines());
        } else {
            model.addAttribute("medicines", medicineService.getAllMedicines());
        }
        model.addAttribute("filter", filter);
        model.addAttribute("lowStockCount", medicineService.countLowStockAlerts());
        model.addAttribute("outOfStockCount", medicineService.countOutOfStockAlerts());
        return "admin/inventory";
    }

    // Restock Action
    @PostMapping("/inventory/{id}/restock")
    public String restock(@PathVariable Long id, @RequestParam("units") int units, RedirectAttributes ra) {
        medicineService.restock(id, units);
        ra.addFlashAttribute("successMsg", "Successfully restocked " + units + " units.");
        return "redirect:/admin/inventory";
    }

    // Medicine CRUD: Add New
    @PostMapping("/inventory/save")
    public String saveMedicine(@Valid @ModelAttribute("medicine") Medicine medicine,
                               BindingResult result, RedirectAttributes ra) {
        if (result.hasErrors()) {
            return "admin/medicine-form";
        }
        medicineService.saveMedicine(medicine);
        ra.addFlashAttribute("successMsg", "Medicine saved successfully.");
        return "redirect:/admin/inventory";
    }

    // Delete Medicine
    @PostMapping("/inventory/{id}/delete")
    public String deleteMedicine(@PathVariable Long id, RedirectAttributes ra) {
        medicineService.deleteMedicine(id);
        ra.addFlashAttribute("successMsg", "Medicine deleted.");
        return "redirect:/admin/inventory";
    }

    // Prescription Review & Verification
    @GetMapping("/prescriptions")
    public String listPrescriptions(Model model) {
        model.addAttribute("prescriptions", prescriptionService.getAllPrescriptions());
        return "admin/prescriptions";
    }

    @PostMapping("/prescriptions/{id}/verify")
    public String verifyPrescription(@PathVariable Long id,
                                     @RequestParam("status") PrescriptionStatus status,
                                     @RequestParam(value = "remarks", required = false) String remarks,
                                     RedirectAttributes ra) {
        prescriptionService.verifyPrescription(id, status, remarks);
        ra.addFlashAttribute("successMsg", "Prescription #" + id + " updated to " + status);
        return "redirect:/admin/prescriptions";
    }

    // Order Processing
    @PostMapping("/orders/{id}/status")
    public String updateOrderStatus(@PathVariable Long id, @RequestParam("status") OrderStatus status, RedirectAttributes ra) {
        orderService.updateOrderStatus(id, status);
        ra.addFlashAttribute("successMsg", "Order #" + id + " status updated to " + status);
        return "redirect:/admin/dashboard";
    }
}`
  },
  {
    path: 'src/main/resources/templates/admin/inventory.html',
    filename: 'inventory.html',
    language: 'html',
    category: 'Thymeleaf Templates',
    description: 'Thymeleaf template for inventory management with low-stock badges, empty-stock alerts, and restock actions',
    content: `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Inventory Management & Stock Alerts</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body class="bg-light">
<div class="container py-4">
    <!-- Header with Alert Badges -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h2 class="fw-bold text-dark">Pharmacy Inventory & Stock List</h2>
            <p class="text-muted">Real-time stock monitoring with automated thresholds</p>
        </div>
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addMedicineModal">
            <i class="bi bi-plus-circle me-1"></i> Add New Medicine
        </button>
    </div>

    <!-- Stock Warning Alerts Banner -->
    <div th:if="\${outOfStockCount > 0}" class="alert alert-danger d-flex align-items-center shadow-sm" role="alert">
        <i class="bi bi-exclamation-octagon-fill fs-4 me-2"></i>
        <div>
            <strong>CRITICAL ALERT:</strong> <span th:text="\${outOfStockCount}">0</span> medicine(s) are completely <strong>OUT OF STOCK</strong>! Immediate supplier order required.
        </div>
    </div>

    <div th:if="\${lowStockCount > 0}" class="alert alert-warning d-flex align-items-center shadow-sm" role="alert">
        <i class="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
        <div>
            <strong>LOW STOCK WARNING:</strong> <span th:text="\${lowStockCount}">0</span> medicine(s) are below the safe threshold (&lt;10 units).
        </div>
    </div>

    <!-- Filter Buttons -->
    <div class="btn-group mb-3 shadow-sm" role="group">
        <a th:href="@{/admin/inventory?filter=ALL}" class="btn btn-outline-secondary" th:classappend="\${filter == 'ALL'} ? 'active'">All Medicines</a>
        <a th:href="@{/admin/inventory?filter=LOW_STOCK}" class="btn btn-outline-warning" th:classappend="\${filter == 'LOW_STOCK'} ? 'active'">Low Stock (&lt;10)</a>
        <a th:href="@{/admin/inventory?filter=OUT_OF_STOCK}" class="btn btn-outline-danger" th:classappend="\${filter == 'OUT_OF_STOCK'} ? 'active'">Out of Stock (0)</a>
    </div>

    <!-- Inventory Table -->
    <div class="card border-0 shadow-sm">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Medicine Name & Generic</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Current Stock</th>
                        <th>Status</th>
                        <th>Expiry Date</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr th:each="med : \${medicines}">
                        <td th:text="\${med.id}">1</td>
                        <td>
                            <div class="fw-bold" th:text="\${med.name}">Amoxicillin</div>
                            <small class="text-muted" th:text="\${med.genericName}">Amox</small>
                        </td>
                        <td><span class="badge bg-secondary" th:text="\${med.category}">Antibiotics</span></td>
                        <td class="fw-semibold" th:text="'$' + \${#numbers.formatDecimal(med.price, 1, 2)}">$18.50</td>
                        <td>
                            <!-- Stock level visual -->
                            <span class="fw-bold fs-6" th:text="\${med.stock}">4</span> units
                        </td>
                        <td>
                            <span th:if="\${med.stock == 0}" class="badge bg-danger">OUT OF STOCK</span>
                            <span th:if="\${med.stock > 0 and med.stock < 10}" class="badge bg-warning text-dark">LOW STOCK (&lt;10)</span>
                            <span th:if="\${med.stock >= 10}" class="badge bg-success">IN STOCK</span>
                        </td>
                        <td th:text="\${med.expiryDate}">2026-11-30</td>
                        <td class="text-end">
                            <!-- Quick Restock Form -->
                            <form th:action="@{/admin/inventory/{id}/restock(id=\${med.id})}" method="post" class="d-inline-flex gap-1">
                                <input type="hidden" name="units" value="50">
                                <button type="submit" class="btn btn-sm btn-outline-success" title="Quick Restock +50 units">
                                    <i class="bi bi-box-arrow-in-down"></i> +50
                                </button>
                            </form>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`
  },
  {
    path: 'src/main/resources/templates/customer/catalog.html',
    filename: 'catalog.html',
    language: 'html',
    category: 'Thymeleaf Templates',
    description: 'Thymeleaf template for customer medicine catalog with search, categorization, and cart controls',
    content: `<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Medicine Catalog | Pharmacy Portal</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body class="bg-light">
<nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div class="container">
        <a class="navbar-brand fw-bold" href="/customer/catalog"><i class="bi bi-capsule-pill me-2"></i>PharmaCare</a>
        <div class="d-flex align-items-center gap-3">
            <a href="/customer/orders" class="btn btn-outline-light btn-sm"><i class="bi bi-bag-check me-1"></i>My Orders</a>
            <a href="/customer/prescriptions" class="btn btn-outline-light btn-sm"><i class="bi bi-file-earmark-medical me-1"></i>Prescriptions</a>
            <a href="/logout" class="btn btn-danger btn-sm">Logout</a>
        </div>
    </div>
</nav>

<div class="container py-4">
    <!-- Search Bar -->
    <form th:action="@{/customer/catalog}" method="get" class="row g-2 mb-4">
        <div class="col-md-9">
            <input type="text" name="search" th:value="\${search}" class="form-control form-control-lg" placeholder="Search medicines by brand name, generic name, or symptom...">
        </div>
        <div class="col-md-3">
            <button type="submit" class="btn btn-primary btn-lg w-100"><i class="bi bi-search me-1"></i> Search Catalog</button>
        </div>
    </form>

    <!-- Medicine Product Grid -->
    <div class="row row-cols-1 row-cols-md-3 g-4">
        <div class="col" th:each="med : \${medicines}">
            <div class="card h-100 shadow-sm border-0">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-info text-dark" th:text="\${med.category}">Category</span>
                        <span th:if="\${med.stock == 0}" class="badge bg-danger">OUT OF STOCK</span>
                        <span th:if="\${med.stock > 0 and med.stock < 10}" class="badge bg-warning text-dark">ONLY \${med.stock} LEFT</span>
                    </div>
                    <h5 class="card-title fw-bold text-primary" th:text="\${med.name}">Medicine Name</h5>
                    <p class="text-muted small mb-2">Generic: <span th:text="\${med.genericName}">Generic</span></p>
                    <p class="card-text text-secondary small" th:text="\${med.uses}">Usage details</p>
                    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                        <span class="fs-4 fw-bold text-dark" th:text="'$' + \${#numbers.formatDecimal(med.price, 1, 2)}">$19.99</span>
                        <form th:action="@{/customer/cart/add}" method="post">
                            <input type="hidden" name="medicineId" th:value="\${med.id}">
                            <button type="submit" class="btn btn-outline-primary" th:disabled="\${med.stock == 0}">
                                <i class="bi bi-cart-plus me-1"></i> Add to Cart
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`
  },
  {
    path: 'src/main/resources/data.sql',
    filename: 'data.sql',
    language: 'sql',
    category: 'Database Scripts',
    description: 'Initial seed data SQL script populating users with BCrypt credentials, inventory with low/out-of-stock items, and sample orders',
    content: `-- Initial Seed Script for Medicine Information & Management System

-- 1. Insert Default Users (Passwords encrypted with BCrypt $2a$10$...)
-- customer@pharma.com / pass123
-- admin@pharma.com / admin123
INSERT INTO users (id, name, email, password, role, address, phone) VALUES
(1, 'Sarah Jenkins', 'customer@pharma.com', '$2a$10$7Q0wWcRzF6GZ.ZzVp7jHhe9aA7k6JpW7rNq9iH5cM9lO2fL8d3kSi', 'ROLE_CUSTOMER', '742 Evergreen Terrace, Springfield, IL', '+1-555-0192'),
(2, 'Dr. Marcus Vance', 'admin@pharma.com', '$2a$10$0V.d.O7a7y7e9q8vM7L.Ue6wUf1H9e5wG8h4r3s2m1k0j9i8h7g6f', 'ROLE_ADMIN', 'Metropolitan Hospital Pharmacy Center', '+1-555-0188');

-- 2. Insert Core Medicines with varied stock levels to test alert thresholds
INSERT INTO medicines (id, name, generic_name, category, price, stock, expiry_date, uses, dosage_info, side_effects, requires_prescription) VALUES
(1, 'Amoxicillin Trihydrate 500mg', 'Amoxicillin', 'Antibiotics & Anti-infectives', 18.50, 4, '2026-11-30', 'Bacterial infections of ear, nose, throat and skin', '1 capsule TID for 7 days', 'Nausea, mild rash', true),
(2, 'Atorvastatin Calcium 20mg', 'Atorvastatin', 'Cardiovascular & Hypertension', 34.00, 0, '2027-04-15', 'Lowers LDL cholesterol and cardiovascular risks', '1 tablet QHS daily', 'Joint pain, mild muscle ache', true),
(3, 'Paracetamol Extra Strength 500mg', 'Acetaminophen', 'Pain Relief & Analgesics', 8.25, 85, '2028-02-28', 'Fever and mild to moderate pain relief', '1-2 tablets every 4-6h PRN', 'Safe within limits', false),
(4, 'Metformin Hydrochloride 850mg', 'Metformin', 'Diabetes & Endocrine', 14.50, 7, '2026-10-15', 'Type 2 diabetes glycemic regulation', '1 tablet twice daily with meals', 'GI upset, metallic taste', true),
(5, 'Omeprazole Delayed-Release 20mg', 'Omeprazole', 'Gastrointestinal & Digestive', 22.00, 48, '2027-08-20', 'GERD, acid reflux and peptic ulcers', '1 capsule every morning before food', 'Headache, flatulence', false);
`
  }
];
