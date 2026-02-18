# Implementation Plan: Customizable Low Stock Alerts

## Phase 1: API Enhancements

Exposing and updating alert thresholds.

- [x] Task: Update Stock Breakdown API (5f54ad4)
  - [x] Modify aggregation in `transactionController.ts` to include `stockId` and `minLevel` in the locations array
  - [x] Update backend tests to verify new fields are present
- [x] Task: Implement Update Stock API (a7137d3)
  - [x] Add `updateStock` controller in `transactionController.ts`
  - [x] Register `PUT /api/transactions/stocks/:id` route
  - [x] Add unit tests for updating `minLevel`

## Phase 2: UI Implementation

Adding control to the Inventory visibility view.

- [x] Task: Update Frontend Types (24e754a)
  - [x] Add `stockId` and `minLevel` to `StockLocationBreakdown` in `types/index.ts`
- [x] Task: Inventory Page UI Updates (8ad3410)
  - [x] Display current `minLevel` in the expanded location list
  - [x] Add an "Edit" button/icon for the alert level
- [x] Task: Alert Level Edit Modal (8ad3410)
  - [x] Create a `SetAlertLevelModal.tsx` or implement inline editing
  - [x] Connect to the backend `PUT` endpoint
- [x] Task: Conductor - User Manual Verification 'Custom Alerts'

## Track Complete [checkpoint: ea653bb]
