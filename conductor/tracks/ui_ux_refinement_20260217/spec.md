# Specification: UI/UX Polish & Advanced Data Control

## Overview
This track aims to elevate the Inventory Management System from a functional prototype to a polished, professional application. The focus is on improving user feedback, ensuring data integrity through strict validation, and enhancing usability for large datasets.

## Core Objectives

### 1. UI/UX Refinement
- **Global Notifications:** Implement a toast system to provide immediate, non-intrusive feedback for user actions (e.g., "Transaction Recorded", "Product Updated").
- **Modal-Based CRUD:** Transition from page-based forms to centered modal dialogs for adding and editing entities, maintaining user context.
- **Skeleton States:** Replace generic "Loading..." text with animated skeleton loaders that mimic the actual layout structure.
- **Improved Empty States:** Design and implement clear, helpful empty states for tables when no data is found or filters return no results.

### 2. Robust Form Management
- **Schema Validation:** Use **Zod** to define strict validation schemas for all inputs (SKUs, email formats, positive numeric values).
- **Interactive Feedback:** Integrate **React Hook Form** to provide real-time field validation and error messaging within the UI.

### 3. Advanced Data Management
- **Backend Pagination:** Update the Product and Transaction APIs to support `page` and `limit` parameters to prevent performance degradation as the database grows.
- **Dynamic Sorting & Filtering:** Implement frontend controls to sort tables by different columns (e.g., Date, Price, Quantity) and filter by specific categories.

### 4. Security & Permissions (RBAC)
- **Action Guarding:** Update the frontend to hide or disable sensitive actions (Delete, Edit) based on the user's role.
- **Backend Enforcement:** Implement a `roleMiddleware` to ensure only authorized roles can access specific API endpoints (e.g., only `warehouse-manager` can delete a product).

## Technical Requirements
- **Frontend Libraries:** `react-hot-toast` for notifications, `headlessui` or `shadcn/ui` concepts for modals.
- **Validation:** `zod` and `@hookform/resolvers/zod`.
- **Backend:** Update Mongoose queries to use `.skip()` and `.limit()` for pagination.

## Acceptance Criteria
- Users receive a visible confirmation toast after every successful "Save" or "Delete" operation.
- Forms prevent submission and show clear red error messages if required fields are missing or invalid.
- Tables load the first 10-20 items and allow navigating through subsequent pages.
- A "Store Clerk" cannot see the "Delete" button on the Products page, and the backend rejects their request if they attempt it manually.
