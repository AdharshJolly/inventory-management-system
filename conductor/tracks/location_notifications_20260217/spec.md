# Specification: Location Management & User Alerts Center

## Overview
This track introduces physical inventory organization through 'Locations' and enhances user engagement with a dedicated 'Notification Center' and personal profile management. 

## Core Objectives

### 1. Multi-Location Tracking
- **Location Entity:** Create a CRUD system for physical storage areas (e.g., "Main Warehouse", "Showroom", "Aisle 4, Shelf B").
- **Stock Assignment:** Update the system to track `Quantity` per `Product` per `Location`.
- **Visibility:** View global stock totals and specific location breakdowns.

### 2. Notification Center (In-App)
- **Proactive Alerts:** Automatically generate system notifications when stock falls below `minLevel`.
- **Activity Log:** Notify relevant users when new suppliers or products are added.
- **UI Center:** A dedicated sidebar or dropdown to view, mark as read, and clear notifications.

### 3. User Profile Management
- **Personal Details:** Allow users to update their display name and contact email.
- **Security:** Implement a secure "Change Password" workflow within the profile page.
- **Preferences:** (Optional) Basic toggle for email notification frequency.

## Technical Architecture
- **Schema Updates:** 
    - `Location` model (Name, Description, Type).
    - Refactor `Stock` to include a reference to `Location` (composite key: Product + Location).
    - `Notification` model (User, Message, Type, isRead, Link).
- **Frontend:** 
    - New 'Locations' management page.
    - 'Profile' settings page.
    - Floating 'Notification Center' component in the Navbar.

## Acceptance Criteria
- Users can create a location and see it as an option when executing stock transactions.
- When stock hits a low level, a red badge appears on the notification icon in the Navbar.
- Clicking a notification takes the user directly to the relevant product page.
- Users can change their password and are required to re-login after the change.
