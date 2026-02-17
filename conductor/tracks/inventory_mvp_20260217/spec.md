# Specification: Inventory Management System MVP

## Overview
This track focuses on building the foundational elements of the Inventory Management System (IMS). The goal is to provide a functional system where users can manage suppliers, products, and monitor stock levels through a centralized dashboard.

## Core Entities

### 1. Supplier
- **Fields:** Name, Contact Person, Email, Phone, Address.
- **Operations:** CRUD (Create, Read, Update, Delete).

### 2. Product
- **Fields:** SKU (Unique Identifier), Name, Category, Description, Base Price, Supplier (Reference to Supplier).
- **Operations:** CRUD.

### 3. Stock (Weak Entity)
- **Fields:** Product (Reference), Current Quantity, Minimum Level (for low-stock alerts), Location (Warehouse/Shelf).
- **Operations:** Read (view status), Automatic updates (via transactions).

### 4. Inventory Transaction (IN/OUT)
- **Fields:** Product (Reference), Type (IN/OUT), Quantity, Date/Time, User (Reference), Notes.
- **Logic:** 
    - `IN`: Increases `Current Quantity`.
    - `OUT`: Decreases `Current Quantity` (must prevent negative stock).

## Functional Requirements

### Dashboard
- **Total Products:** Total count of unique products.
- **Total Stock Value:** Calculated sum of (Price * Quantity).
- **Low Stock Alerts:** List of products where `Current Quantity` <= `Minimum Level`.
- **Recent Transactions:** Display the last 5-10 stock movements.

### Product & Supplier Management
- Searchable lists for both entities.
- Forms for creating and editing details.
- Validation for unique SKU and required fields.

### Transaction Management
- Simplified interface to record stock IN/OUT.
- History log of all transactions.

## Technical Architecture
- **Frontend:** React with Tailwind CSS, using React Context for state.
- **Backend:** Node.js/Express with Bun runtime.
- **Database:** MongoDB with Mongoose ODM.
- **API Style:** RESTful JSON API.
- **Authentication:** JWT-based (to be implemented as a core foundation).

## Acceptance Criteria
- Users can create a supplier and then assign a product to that supplier.
- Stock levels are correctly updated after an "IN" or "OUT" transaction.
- The dashboard correctly displays the "Low Stock" status of a product when its quantity falls below the threshold.
- API endpoints are protected by JWT authentication (basic flow).
- Unit and integration tests cover at least 80% of the core logic.
