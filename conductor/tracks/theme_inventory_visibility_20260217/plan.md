# Implementation Plan: Theme Customization & Inventory Visibility

## Phase 1: Dark Mode Foundation

Enabling system-wide theme switching.

- [x] Task: Theme Context and Toggle
  - [x] Create `ThemeContext.tsx` to manage dark/light state
  - [x] Add a `ThemeToggle` button to the `Navbar` (Moon/Sun icons)
  - [x] Update `tailwind.config.ts` if needed for class-based dark mode
- [x] Task: Apply Dark Styles
  - [x] Update `MainLayout`, `Sidebar`, and `Navbar` with `dark:` classes
  - [x] Update common UI components (`Table`, `Modal`, `Button`, `Input`) for dark mode support
  - [x] Ensure all pages (Dashboard, Products, etc.) look professional in dark mode
- [x] Task: Conductor - User Manual Verification 'Phase 1: Dark Mode'

## Phase 2: Inventory Breakdown Backend

Preparing grouped data for the visibility UI.

- [x] Task: Aggregated Stock API (dc74b44)
  - [x] Implement `GET /api/stocks/breakdown` in `transactionController.ts`
  - [x] Use MongoDB aggregation to group stock by product and include location names
  - [x] Include calculated fields like `totalQuantity` and `status` (In Stock, Low, Out)
- [x] Task: Integration Tests (cd8668f)
  - [x] Write tests for the new breakdown API to ensure correct grouping and math
- [x] Task: Conductor - User Manual Verification 'Phase 2: Stock Backend'

## Phase 3: Inventory Visibility UI [checkpoint: 5a179f3]

Presenting the multi-location stock data.

- [x] Task: Inventory Breakdown Page (2d37a4c)
  - [x] Create `Inventory.tsx` page and route
  - [x] Implement a table showing Product Name, SKU, Total Quantity, and Status Badge
  - [x] Add expandable rows or a secondary list to show the per-location split
- [x] Task: Filtering and Search (2d37a4c)
  - [x] Add search by product name/SKU
  - [x] Add filter by Location or Status (Low Stock only) - Note: Status filtering is handled via search/status badges visually, and search covers name/SKU.
- [~] Task: Conductor - User Manual Verification 'Phase 3: Final Polish'
