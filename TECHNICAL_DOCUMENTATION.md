# Pet-Mart Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [API Documentation](#api-documentation)
5. [Database Schema](#database-schema)
6. [Security Implementation](#security-implementation)
7. [Frontend Components](#frontend-components)
8. [Backend Services](#backend-services)
9. [Authentication Flow](#authentication-flow)
10. [Deployment Guide](#deployment-guide)

## Project Overview
Pet-Mart is a full-stack web application for pet adoption and management. It provides a platform for users to browse, adopt, and manage pets, with separate interfaces for regular users and administrators.

### Key Features
- User authentication and authorization
- Pet browsing and searching
- Shopping cart functionality
- Reservation system
- Admin dashboard for pet management
- Responsive design for all devices

## Technology Stack

### Frontend
- React.js
- React Bootstrap
- React Router
- Axios for API calls
- React Toastify for notifications
- CSS3 with modern features

### Backend
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL Database
- JWT Authentication

## System Architecture

### Frontend Architecture
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API service calls
│   ├── utils/         # Utility functions
│   └── App.js         # Main application component
```

### Backend Architecture
```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   ├── controllers/    # REST controllers
│   │   │   ├── models/        # Entity classes
│   │   │   ├── repositories/  # Data access layer
│   │   │   ├── services/      # Business logic
│   │   │   └── security/      # Security configuration
│   │   └── resources/
│   │       └── application.properties
```

## API Documentation

### Authentication APIs

#### 1. User Registration
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: JWT token and user details

#### 2. User Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**: JWT token and user details

### Product (Pet) APIs

#### 1. Get All Products
- **Endpoint**: `GET /api/products`
- **Description**: Retrieve all available pets
- **Query Parameters**:
  - `type`: Filter by pet type
  - `status`: Filter by availability status
- **Response**: List of products with details

#### 2. Get Product by ID
- **Endpoint**: `GET /api/products/{code}`
- **Description**: Get detailed information about a specific pet
- **Response**: Product details

### Cart APIs

#### 1. Get Cart
- **Endpoint**: `GET /api/cart`
- **Description**: Get current user's cart
- **Response**: Cart details with items

#### 2. Add to Cart
- **Endpoint**: `POST /api/cart/add`
- **Description**: Add a pet to cart
- **Request Body**:
  ```json
  {
    "productCode": "string",
    "quantity": "number"
  }
  ```

#### 3. Remove from Cart
- **Endpoint**: `DELETE /api/cart/remove/{productCode}`
- **Description**: Remove a pet from cart

### Reservation APIs

#### 1. Create Reservation
- **Endpoint**: `POST /api/reservations`
- **Description**: Create a new pet reservation
- **Request Body**:
  ```json
  {
    "petId": "string",
    "preferredVisitDate": "date",
    "notes": "string"
  }
  ```

#### 2. Get User Reservations
- **Endpoint**: `GET /api/reservations/user`
- **Description**: Get all reservations for current user

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    breed VARCHAR(50),
    age INT,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Cart Table
```sql
CREATE TABLE cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Security Implementation

### JWT Authentication
- Token-based authentication using JWT
- Token expiration: 24 hours
- Secure password hashing using BCrypt
- Role-based access control (ROLE_USER, ROLE_ADMIN)

### Security Headers
- CORS configuration
- XSS protection
- CSRF protection
- Content Security Policy

## Frontend Components

### Core Components
1. **HeaderComponent**
   - Navigation bar
   - User authentication status
   - Cart icon with count
   - Admin dashboard link

2. **ProductCard**
   - Pet information display
   - Add to cart functionality
   - Image handling
   - Price display

3. **CartComponent**
   - Cart items list
   - Quantity management
   - Price calculation
   - Checkout process

### Pages
1. **Home**
   - Featured pets
   - Search functionality
   - Category filters

2. **FindPet**
   - Pet listing
   - Advanced search
   - Filtering options

3. **Profile**
   - User information
   - Order history
   - Reservation management

## Backend Services

### UserService
- User registration
- User authentication
- Profile management
- Role management

### ProductService
- Product CRUD operations
- Inventory management
- Search and filtering
- Image handling

### CartService
- Cart management
- Item addition/removal
- Price calculation
- Stock validation

### ReservationService
- Reservation creation
- Status management
- Visit scheduling
- Notification handling

## Authentication Flow

1. **Registration**
   - User submits registration form
   - Backend validates data
   - Password is hashed
   - User is created in database
   - JWT token is generated

2. **Login**
   - User submits credentials
   - Backend validates credentials
   - JWT token is generated
   - Token is stored in localStorage

3. **Protected Routes**
   - Token is sent with each request
   - Backend validates token
   - Access is granted/denied based on role

## Deployment Guide

### Prerequisites
- Node.js 14+
- Java 11+
- MySQL 8+
- Maven

### Frontend Deployment
1. Build the React application:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Serve the build:
   ```bash
   serve -s build
   ```

### Backend Deployment
1. Build the Spring Boot application:
   ```bash
   cd backend
   mvn clean package
   ```

2. Run the JAR file:
   ```bash
   java -jar target/pet-mart-0.0.1-SNAPSHOT.jar
   ```

### Environment Configuration
1. Frontend (.env):
   ```
   REACT_APP_API_URL=http://localhost:8080
   ```

2. Backend (application.properties):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/pet_mart
   spring.datasource.username=root
   spring.datasource.password=password
   jwt.secret=your-secret-key
   ```

## Best Practices Implemented

1. **Code Organization**
   - Modular component structure
   - Service-based architecture
   - Clear separation of concerns

2. **Security**
   - Input validation
   - SQL injection prevention
   - XSS protection
   - Secure password handling

3. **Performance**
   - Lazy loading
   - Image optimization
   - Caching strategies
   - Database indexing

4. **User Experience**
   - Responsive design
   - Loading states
   - Error handling
   - Toast notifications

## Future Enhancements

1. **Features**
   - Payment gateway integration
   - Email notifications
   - Pet health records
   - User reviews and ratings

2. **Technical**
   - Microservices architecture
   - Real-time updates
   - Advanced search capabilities
   - Mobile application

## Support and Maintenance

### Monitoring
- Application logs
- Error tracking
- Performance metrics
- User analytics

### Backup
- Database backups
- File system backups
- Configuration backups

### Updates
- Security patches
- Feature updates
- Bug fixes
- Performance improvements 