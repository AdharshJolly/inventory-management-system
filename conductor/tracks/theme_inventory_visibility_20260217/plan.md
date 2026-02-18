# Implementation Plan: Theme Customization & Inventory Visibility

## Phase 1: Dark Mode Foundation

Enabling system-wide theme switching.

- [ ] Task: Theme Context and Toggle
  - [ ] Create `ThemeContext.tsx` to manage dark/light state
  - [ ] Add a `ThemeToggle` button to the `Navbar` (Moon/Sun icons)
  - [ ] Update `tailwind.config.ts` if needed for class-based dark mode
- [ ] Task: Apply Dark Styles
  - [ ] Update `MainLayout`, `Sidebar`, and `Navbar` with `dark:` classes
  - [ ] Update common UI components (`Table`, `Modal`, `Button`, `Input`) for dark mode support
  - [ ] Ensure all pages (Dashboard, Products, etc.) look professional in dark mode
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Dark Mode'

## Phase 2: Inventory Breakdown Backend

Preparing grouped data for the visibility UI.

- [ ] Task: Aggregated Stock API
  - [ ] Implement `GET /api/stocks/breakdown` in `transactionController.ts`
  - [ ] Use MongoDB aggregation to group stock by product and include location names
  - [ ] Include calculated fields like `totalQuantity` and `status` (In Stock, Low, Out)
- [ ] Task: Integration Tests
  - [ ] Write tests for the new breakdown API to ensure correct grouping and math
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Stock Backend'

## Phase 3: Inventory Visibility UI

Presenting the multi-location stock data.

- [ ] Task: Inventory Breakdown Page
  - [ ] Create `Inventory.tsx` page and route
  - [ ] Implement a table showing Product Name, SKU, Total Quantity, and Status Badge
  - [ ] Add expandable rows or a secondary list to show the per-location split
- [ ] Task: Filtering and Search
  - [ ] Add search by product name/SKU
  - [ ] Add filter by Location or Status (Low Stock only)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Polish'
