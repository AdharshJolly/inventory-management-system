# Specification: Theme Customization & Inventory Visibility

## Overview
This track enhances user experience through a toggleable Dark Mode and provides deep visibility into stock distribution via a new comprehensive Inventory Breakdown page.

## Core Objectives

### 1. Dark Mode Toggle
- **System-Wide Support:** Apply dark styles to every component (Navbar, Sidebar, Modals, Tables, Forms).
- **Preference Persistence:** Save the user's theme choice in `localStorage`.
- **Seamless Integration:** Use Tailwind CSS's built-in `dark:` variants for a polished look.

### 2. Comprehensive Inventory Breakdown
- **Unified Stock View:** A new page that lists all products and their **total** stock.
- **Location Detail:** Allow drilling down or expanding a product to see exactly how many units are in each location (e.g., "Warehouse A: 50, Showroom B: 10").
- **Status Indicators:** 
    - **In Stock (Green):** Quantity well above `minLevel`.
    - **Low Stock (Amber):** Quantity at or slightly above `minLevel`.
    - **Out of Stock (Red):** Quantity at 0.

### 3. Advanced Backend Grouping
- **Aggregated Data:** Create or update the stock API to return data grouped by product with nested location breakdowns.
- **Filtering:** Filter by location or status (e.g., "Show all low-stock items in Warehouse A").

## Technical Architecture
- **Frontend Theme Context:** A `ThemeProvider` to manage the `dark` class on the `<html>` element.
- **New API Endpoint:** `GET /api/stocks/breakdown` using MongoDB aggregation to group stock by product ID.
- **UI Component:** A hierarchical table or a list of "Inventory Cards" with detailed breakdowns.

## Acceptance Criteria
- Clicking the moon/sun icon in the Navbar instantly toggles the theme.
- The Inventory page shows a list of products with a "Total Stock" column and a way to see the per-location split.
- Status badges (In Stock, Low Stock, etc.) update dynamically based on the current quantity across all locations.
