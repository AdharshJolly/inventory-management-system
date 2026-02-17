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

- [x] Task: Schema-Based Validation a84a9b9
    - [x] Install `zod`, `react-hook-form`, and `@hookform/resolvers`
    - [x] Define Zod schemas for Product and Supplier entities
    - [x] Refactor Product and Supplier "Add" forms to use React Hook Form with real-time validation
- [x] Task: Modal-Based Workflows a84a9b9
    - [x] Create a reusable `Modal` component
    - [x] Refactor "Add Product" and "Add Supplier" to open in modals instead of separate paths
- [x] Task: Edit and Delete Functionality 2feba7e
    - [x] Add "Edit" and "Delete" buttons to Product and Supplier tables
    - [x] Implement Delete confirmation dialogs
    - [x] Implement Edit modals populated with existing data for both entities
- [x] Task: Conductor - User Manual Verification 'Phase 2: Validation & Modals' a84a9b9

## Phase 3: Advanced Data & Pagination
Improving performance and usability for growing datasets.

- [x] Task: Backend Pagination Support 1e0d1e5
    - [x] Update Product and Transaction controllers to support `page` and `limit`
    - [x] Update API responses to include `totalDocs`, `totalPages`, and `currentPage`
- [x] Task: Frontend Pagination & Sorting 1e0d1e5
    - [x] Implement a `Pagination` component for tables
    - [x] Add "Sort by" headers to the Product and History tables
- [x] Task: Searchable Select for Transactions 7510922
    - [x] Create reusable `Combobox` component
    - [x] Integrate `Combobox` into Transaction Execution page for product selection
- [x] Task: Conductor - User Manual Verification 'Phase 3: Pagination & Sorting' 8ee9112

## Phase 4: RBAC & Final Polish
Securing actions and finishing the interface.

- [x] Task: Role-Based Backend Protection 1be5568
    - [x] Implement `authorize` middleware in backend
    - [x] Protect DELETE and PUT routes for Products/Suppliers (Managers only)
- [x] Task: Conditional UI Actions 1be5568
    - [x] Implement `RoleGuard` component or logic in frontend
    - [x] Hide "Delete" buttons for users with the `store-clerk` role
- [x] Task: Final Polish & Asset Audit d5e019c
    - [x] Review all empty states and ensure consistent margins/padding
    - [x] Final quality audit across all layers
- [x] Task: Conductor - User Manual Verification 'Phase 4: RBAC & Polish' d5e019c
