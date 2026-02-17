# Implementation Plan: Location Management & User Alerts Center

## Phase 1: Location Foundation
Establishing the base for physical inventory organization.

- [ ] Task: Location Model and CRUD API
    - [ ] Create `Location` Mongoose model
    - [ ] Implement backend CRUD controllers and routes for Locations
    - [ ] Write integration tests for Location API
- [ ] Task: Location Management UI
    - [ ] Create 'Locations' page in frontend
    - [ ] Implement Add/Edit/Delete functionality for Locations using the existing Modal pattern
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Location Management'

## Phase 2: Inventory Integration
Mapping stock to specific physical areas.

- [ ] Task: Schema Refactoring (Stock & Transaction)
    - [ ] Update `Stock` model to include `location` reference
    - [ ] Update `Transaction` model to include `location` (source/destination)
- [ ] Task: Refactor Transaction Logic
    - [ ] Update `createTransaction` controller to handle specific locations
    - [ ] Ensure stock is updated correctly per product-location pair
- [ ] Task: UI Updates for Transactions
    - [ ] Update 'Execute Transaction' form to include a 'Location' searchable dropdown
    - [ ] Update 'History' table to show location for each movement
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Location Integration'

## Phase 3: Notification Infrastructure
Building the engine for proactive alerts.

- [ ] Task: Notification Model and Logic
    - [ ] Create `Notification` Mongoose model
    - [ ] Implement `createNotification` utility in backend
    - [ ] Add hooks to `createTransaction` to trigger notifications on low stock
- [ ] Task: Notification API
    - [ ] Create `GET /api/notifications` (paginated)
    - [ ] Create `PATCH /api/notifications/:id/read`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Notification Backend'

## Phase 4: Notification UI
Connecting the user to the alert system.

- [ ] Task: Notification Center Component
    - [ ] Create a dropdown component in the `Navbar` for alerts
    - [ ] Implement real-time indicator (badge) for unread counts
- [ ] Task: Notification Management
    - [ ] Implement 'Mark all as read' functionality
    - [ ] Ensure clicking an alert navigates to the relevant page (e.g., Product detail)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Notification UI'

## Phase 5: User Profile & Security
Enhancing personal settings and account safety.

- [ ] Task: Profile Settings Page
    - [ ] Create `/profile` route and page
    - [ ] Implement form to update Name and Email
- [ ] Task: Password Management
    - [ ] Implement secure "Change Password" API endpoint
    - [ ] Add password change form with validation to the Profile page
- [ ] Task: Final Polish & Audit
    - [ ] Ensure all new features follow RBAC rules (e.g., only managers create locations)
    - [ ] Final quality audit
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Profile & Final Polish'
