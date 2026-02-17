# Implementation Plan: UI/UX Refinement & Advanced Data Control

## Phase 1: UI Infrastructure and Feedback
Setting up the foundations for a smoother user experience.

- [x] Task: Global Feedback System 440af03
    - [x] Install `react-hot-toast`
    - [x] Implement a `ToastProvider` and update `App.tsx`
    - [x] Add success/error toasts to all existing form submissions (Login, Transactions)
- [x] Task: Skeleton Loaders & Better Loading States 440af03
    - [x] Create a reusable `Skeleton` component
    - [x] Replace "Loading..." text in Dashboard, Products, and Suppliers with skeleton tables/cards
- [x] Task: Conductor - User Manual Verification 'Phase 1: UI Infrastructure' 440af03

## Phase 2: Form & Validation Overhaul
Ensuring data integrity and providing better user guidance.

- [ ] Task: Schema-Based Validation
    - [ ] Install `zod`, `react-hook-form`, and `@hookform/resolvers`
    - [ ] Define Zod schemas for Product and Supplier entities
    - [ ] Refactor Product and Supplier "Add" forms to use React Hook Form with real-time validation
- [ ] Task: Modal-Based Workflows
    - [ ] Create a reusable `Modal` component
    - [ ] Refactor "Add Product" and "Add Supplier" to open in modals instead of separate paths
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Validation & Modals'

## Phase 3: Advanced Data & Pagination
Improving performance and usability for growing datasets.

- [ ] Task: Backend Pagination Support
    - [ ] Update Product and Transaction controllers to support `page` and `limit`
    - [ ] Update API responses to include `totalDocs`, `totalPages`, and `currentPage`
- [ ] Task: Frontend Pagination & Sorting
    - [ ] Implement a `Pagination` component for tables
    - [ ] Add "Sort by" headers to the Product and History tables
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Pagination & Sorting'

## Phase 4: RBAC & Final Polish
Securing actions and finishing the interface.

- [ ] Task: Role-Based Backend Protection
    - [ ] Implement `authorize` middleware in backend
    - [ ] Protect DELETE and PUT routes for Products/Suppliers (Managers only)
- [ ] Task: Conditional UI Actions
    - [ ] Implement `RoleGuard` component or logic in frontend
    - [ ] Hide "Delete" buttons for users with the `store-clerk` role
- [ ] Task: Final Polish & Asset Audit
    - [ ] Review all empty states and ensure consistent margins/padding
    - [ ] Final quality audit across all layers
- [ ] Task: Conductor - User Manual Verification 'Phase 4: RBAC & Polish'
