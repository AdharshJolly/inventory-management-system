# Implementation Plan: Inventory Management System MVP

## Phase 1: Foundation and Initial Backend
Building the core environment and the REST API for the Inventory Management System.

- [x] Task: Project Scaffolding (Node.js/Bun, Express, Mongoose)
    - [x] Initialize project with `bun init`
    - [x] Install essential dependencies: `express`, `mongoose`, `cors`, `dotenv`, `jsonwebtoken`, `bcryptjs`
    - [x] Configure environment variables (`.env`) for MongoDB and JWT secret
    - [x] Set up basic Express server structure (`server.js`, `routes/`, `models/`, `controllers/`, `middleware/`, `config/`)
- [ ] Task: MongoDB Models (Supplier, Product, Transaction, Stock, User)
    - [ ] Write Tests: Model validation tests
    - [ ] Implement Feature: Create Mongoose schemas for Supplier, Product, Transaction, Stock, and User
- [ ] Task: Authentication Foundation (JWT and Middlewares)
    - [ ] Write Tests: Auth controller and middleware tests
    - [ ] Implement Feature: Create `User` controller for Register/Login
    - [ ] Implement Feature: Create `authMiddleware` to protect routes
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation and Initial Backend' (Protocol in workflow.md)

## Phase 2: CRUD APIs (Suppliers & Products)
Building the RESTful endpoints for managing core entities.

- [ ] Task: Supplier API (CRUD)
    - [ ] Write Tests: Supplier controller unit and integration tests
    - [ ] Implement Feature: Create routes and controller for Supplier CRUD
- [ ] Task: Product API (CRUD)
    - [ ] Write Tests: Product controller unit and integration tests
    - [ ] Implement Feature: Create routes and controller for Product CRUD (must reference a Supplier)
- [ ] Task: Conductor - User Manual Verification 'Phase 2: CRUD APIs (Suppliers & Products)' (Protocol in workflow.md)

## Phase 3: Inventory Logic and Dashboard API
Implementing the core business logic and data aggregation.

- [ ] Task: Inventory Transaction API (IN/OUT)
    - [ ] Write Tests: Transaction logic tests (including atomic stock updates)
    - [ ] Implement Feature: Create transaction controller and routes
    - [ ] Implement Feature: Add logic to update `Current Quantity` in the `Stock` entity after each transaction
- [ ] Task: Dashboard and Analytics API
    - [ ] Write Tests: Dashboard aggregation tests
    - [ ] Implement Feature: Create API endpoint for Dashboard stats (Total products, Stock value, Low stock alerts)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Inventory Logic and Dashboard API' (Protocol in workflow.md)

## Phase 4: Frontend Development (React & Tailwind)
Building the user interface to interact with the API.

- [ ] Task: Frontend Scaffolding (React, Vite, Tailwind, Axios)
    - [ ] Initialize frontend with `bun x create-vite frontend --template react`
    - [ ] Install dependencies: `axios`, `react-router-dom`, `tailwindcss`, `autoprefixer`, `postcss`, `lucide-react`
    - [ ] Configure Tailwind CSS and folder structure (`src/components/`, `src/pages/`, `src/context/`, `src/api/`, `src/hooks/`)
- [ ] Task: Auth and State Management
    - [ ] Write Tests: Auth context tests
    - [ ] Implement Feature: Create `AuthContext` to manage user login state and Axios interceptors for JWT
- [ ] Task: Core UI Components (Layout, Forms, Tables)
    - [ ] Write Tests: UI component tests (using React Testing Library)
    - [ ] Implement Feature: Create reusable components for Layout, Navigation, Tables, and Forms
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Frontend Development (React & Tailwind)' (Protocol in workflow.md)

## Phase 5: MVP Polish and Integration
Finalizing the features and ensuring a cohesive user experience.

- [ ] Task: Dashboard and Inventory Pages
    - [ ] Write Tests: Dashboard and Inventory page integration tests
    - [ ] Implement Feature: Build Dashboard page with visualizations and alerts
    - [ ] Implement Feature: Build Product/Supplier management pages and Transaction recording interface
- [ ] Task: Final Quality Audit and Bug Fixes
    - [ ] Verify overall code coverage (>80%)
    - [ ] Perform comprehensive integration testing across all layers
- [ ] Task: Conductor - User Manual Verification 'Phase 5: MVP Polish and Integration' (Protocol in workflow.md)
