# Implementation Plan: Location Management & User Alerts Center

## Phase 1: Location Foundation
Establishing the base for physical inventory organization.

- [x] Task: Location Model and CRUD API 2713412
    - [x] Create `Location` Mongoose model
    - [x] Implement backend CRUD controllers and routes for Locations
    - [x] Write integration tests for Location API
- [x] Task: Location Management UI 2721adb
    - [x] Create 'Locations' page in frontend
    - [x] Implement Add/Edit/Delete functionality for Locations using the existing Modal pattern
- [x] Task: Conductor - User Manual Verification 'Phase 1: Location Management' 7561519

## Phase 2: Inventory Integration
Mapping stock to specific physical areas.

- [x] Task: Schema Refactoring (Stock & Transaction)
    - [x] Update `Stock` model to include `location` reference
    - [x] Update `Transaction` model to include `location` (source/destination)
- [x] Task: Refactor Transaction Logic
    - [x] Update `createTransaction` controller to handle specific locations
    - [x] Ensure stock is updated correctly per product-location pair
- [x] Task: UI Updates for Transactions ffad046
    - [x] Update 'Execute Transaction' form to include a 'Location' searchable dropdown
    - [x] Update 'History' table to show location for each movement
- [x] Task: Conductor - User Manual Verification 'Phase 2: Location Integration' e6018a0

## Phase 3: Notification Infrastructure
Building the engine for proactive alerts.

- [x] Task: Notification Model and Logic 5a4328b
    - [x] Create `Notification` Mongoose model
    - [x] Implement `createNotification` utility in backend
    - [x] Add hooks to `createTransaction` to trigger notifications on low stock
- [x] Task: Notification API 5a4328b
    - [x] Create `GET /api/notifications` (paginated)
    - [x] Create `PATCH /api/notifications/:id/read`
- [x] Task: Conductor - User Manual Verification 'Phase 3: Notification Backend' 1ffc2c4

## Phase 4: Notification UI
Connecting the user to the alert system.

- [x] Task: Notification Center Component f9bd0f5
    - [x] Create a dropdown component in the `Navbar` for alerts
    - [x] Implement real-time indicator (badge) for unread counts
- [x] Task: Notification Management f9bd0f5
    - [x] Implement 'Mark all as read' functionality
    - [x] Ensure clicking an alert navigates to the relevant page (e.g., Product detail)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Notification UI' f9bd0f5

## Phase 5: User Profile & Security
Enhancing personal settings and account safety.

- [x] Task: Profile Settings Page 558959b
    - [x] Create `/profile` route and page
    - [x] Implement form to update Name and Email
- [x] Task: Password Management 558959b
    - [x] Implement secure "Change Password" API endpoint
    - [x] Add password change form with validation to the Profile page
- [x] Task: Final Polish & Audit 558959b
    - [x] Ensure all new features follow RBAC rules (e.g., only managers create locations)
    - [x] Final quality audit
- [~] Task: Conductor - User Manual Verification 'Phase 5: Profile & Final Polish'
