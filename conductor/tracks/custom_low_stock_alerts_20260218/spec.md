# Specification: Customizable Low Stock Alerts

## Overview
Allows users to define custom `minLevel` values for each product-location combination. This ensures that low stock alerts and status indicators match the unique inventory requirements of different warehouses or showrooms.

## Core Objectives

### 1. Granular Alert Management
- **Individual Control:** Set the `minLevel` for a specific product at a specific location.
- **Dynamic Updates:** Change the alert threshold at any time to adapt to seasonal demand or operational shifts.

### 2. Enhanced Data Model Visibility
- **Backend Transparency:** The stock breakdown API will now expose the unique `stockId` and `minLevel` for every entry.
- **Frontend Integration:** Users can see the current `minLevel` directly in the inventory view.

### 3. Immediate Feedback
- **Status Recalculation:** Status badges (In Stock / Low Stock) will instantly update based on the new thresholds.
- **Notification Logic:** Future transactions will trigger alerts using the updated levels.

## Technical Architecture
- **Backend Route:** `PUT /api/transactions/stocks/:id` to update the `minLevel` field in the `Stock` model.
- **Aggregation Update:** Modify the `getStockBreakdown` pipeline to include `_id` and `minLevel` in the `$push` operator.
- **Frontend UI:** Add an edit icon next to the quantity in the `Inventory` page's expanded view, triggering a "Set Alert Level" modal.

## Acceptance Criteria
- Expanding a product in the Inventory page shows the current Alert Level (minLevel) for each location.
- Clicking the edit icon opens a modal allowing the user to change the Alert Level.
- Saving the new level updates the status badge (e.g., if total stock is 10 and minLevel is changed from 5 to 15, the status should change to 'Low Stock').
