# Dineo - Restaurant Management System

A restaurant management system built with Spring Boot and H2 database for my CS Capstone 2026.

## Tech Stack
- Java 17, Spring Boot, Spring Data JPA
- H2 embedded database
- HTML, CSS, JavaScript
- Maven

## How to Run

**Requirements:** Java 17+, Maven

```bash
git clone https://github.com/RonishGautam/CScapstone2026.git
cd CScapstone2026
mvn spring-boot:run
```

Open in browser: `http://localhost:8080`

H2 Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/dineoDb`
- Username: `sa`
- Password: *(leave blank)*

## Features
- Dashboard with inventory overview
- Menu item, ingredient, and category management
- Low stock alerts
- Sample data loaded automatically on first run

## Author
Ronish Gautam
