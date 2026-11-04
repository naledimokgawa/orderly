# Feature Specification: Orderly - Small Business Order Manager

**Feature Branch**: `001-orderly-order-management`
**Created**: 2026-09-12
**Status**: Draft
**Input**: Project specification for a small-business order management application.

## Project Overview

Orderly is an internal web application that helps small food businesses manage customer orders
from creation through completion. It gives authorized staff one place to capture customer and
order details, review active orders, correct mistakes, and remove records that are no longer
needed.

### Purpose

The product exists to replace scattered, error-prone order tracking with a clear workflow that
reduces missed orders, incorrect quantities, and time spent searching for order information.

### Target Audience

- Owners and managers of small food businesses
- Staff members who create and update customer orders
- Staff members who need a quick read-only view of current and previous orders

## User Scenarios & Testing

### User Story 1 - Staff Member Signs Up (Priority: P1)

As a business owner or invited staff member, I want to create an account so that I can securely
access Orderly and manage the business's orders.

**Why this priority**: Authentication establishes the controlled workspace required for every
other workflow and protects customer information.

**Independent Test**: Submit valid sign-up details and confirm that a new user account is created
and the user can access the authenticated application. Submit invalid or duplicate details and
confirm that the account is not created and a useful error is shown.

**Acceptance Scenarios**:

1. **Given** a visitor is on the sign-up page, **When** they submit a unique valid name, email,
   and password, **Then** the system creates the account and shows the authenticated application.
2. **Given** the submitted email is already registered, **When** the visitor submits the form,
   **Then** the system rejects the request without creating a duplicate account and explains the
   problem without revealing another user's private data.
3. **Given** one or more required fields are missing or invalid, **When** the visitor submits the
   form, **Then** the form identifies the invalid fields and does not send an incomplete request.
4. **Given** a password does not meet the displayed requirements, **When** the visitor submits the
   form, **Then** the account is not created and the password requirements remain visible.

### User Story 2 - Staff Member Creates an Order (Priority: P1)

As an order-taking staff member, I want to record a new customer order so that the kitchen or
fulfillment team can act on accurate information.

**Why this priority**: Capturing a new order is the primary business value and the minimum useful
workflow after access is established.

**Independent Test**: Sign in, submit a valid order with customer details and at least one item,
and confirm that the order appears in the order list with the correct total and initial status.

**Acceptance Scenarios**:

1. **Given** an authenticated staff member is on the new-order form, **When** they submit valid
   customer details and one or more items with positive quantities, **Then** the system creates
   the order and returns its identifier, status, items, and calculated total.
2. **Given** an order has no items, an invalid quantity, or missing required customer details,
   **When** the staff member submits it, **Then** the system rejects it and identifies the fields
   that must be corrected.
3. **Given** an item price and quantity are valid, **When** the order is created, **Then** the
   total is calculated from the submitted line items and cannot be supplied as an unchecked value.
4. **Given** an order is created successfully, **When** the response is shown, **Then** the staff
   member receives a clear confirmation and the order is visible in the active-order list.

### User Story 3 - Staff Member Reads Orders (Priority: P1)

As a staff member, I want to view and search orders so that I can quickly understand what needs
to be prepared, collected, or delivered.

**Why this priority**: Reliable visibility is necessary for fulfillment and customer service.

**Independent Test**: Seed multiple orders with different statuses and confirm that the list and
detail views show the correct records, fields, totals, and statuses for the authenticated user.

**Acceptance Scenarios**:

1. **Given** an authenticated staff member opens the orders page, **When** orders exist,
   **Then** the system shows each order's identifier, customer, status, total, and creation time.
2. **Given** a staff member requests one order by identifier, **When** that order exists and is
   accessible, **Then** the system shows its customer details, line items, quantities, prices,
   total, status, and timestamps.
3. **Given** a staff member filters by status or searches by an order identifier or customer
   name, **When** matching orders exist, **Then** only matching accessible orders are shown.
4. **Given** no orders match the request, **When** the staff member views the result, **Then** the
   system shows an empty state that explains there are no matching orders.

### User Story 4 - Staff Member Updates an Order (Priority: P2)

As a manager or authorized staff member, I want to correct order details and update order status
so that the operational record remains accurate as work progresses.

**Why this priority**: Corrections and status changes prevent avoidable fulfillment errors, but
require the create and read workflows to exist first.

**Independent Test**: Update an existing order's customer details, items, or status and confirm
that the saved detail and list views show the new values while preserving the order identifier
and creation history.

**Acceptance Scenarios**:

1. **Given** an accessible existing order, **When** an authorized staff member submits valid
   changes, **Then** the system saves the changes and returns the updated order.
2. **Given** an update contains invalid fields or removes every item, **When** it is submitted,
   **Then** the system rejects the update, leaves the existing order unchanged, and explains the
   validation errors.
3. **Given** a staff member changes an order status, **When** the status transition is allowed,
   **Then** the new status is shown consistently in the detail and list views.
4. **Given** a requested order does not exist, **When** an update is attempted, **Then** the
   system returns a not-found response without creating a replacement record.

### User Story 5 - Staff Member Deletes an Order (Priority: P3)

As an authorized manager, I want to remove an order that was entered by mistake so that the
active order list remains trustworthy and manageable.

**Why this priority**: Deletion is useful for data hygiene but is less frequent and carries more
risk than creating, reading, or correcting an order.

**Independent Test**: Request deletion of an existing order, confirm the system requires explicit
confirmation, and verify that the order is no longer returned by normal list or detail requests.

**Acceptance Scenarios**:

1. **Given** an authorized manager views an existing order, **When** they explicitly confirm its
   deletion, **Then** the system removes it from normal order queries and confirms completion.
2. **Given** a manager starts deletion but cancels confirmation, **When** they return to the
   order, **Then** the order remains unchanged.
3. **Given** an order identifier does not exist, **When** deletion is requested, **Then** the
   system returns a not-found response and does not affect other orders.
4. **Given** a staff member lacks delete permission, **When** they request deletion, **Then** the
   system refuses the request and the order remains available.

## API Endpoints

All endpoints are under `/api` and require authentication unless noted otherwise. JSON responses
MUST use consistent error objects with a human-readable `message` and, when applicable, a list of
field-level `errors`.

| Method | Endpoint | Priority | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/signup` | P1 | Create a staff account from name, email, and password |
| `GET` | `/api/orders` | P1 | List accessible orders with optional `status`, `search`, `page`, and `limit` filters |
| `POST` | `/api/orders` | P1 | Create an order with customer details and one or more line items |
| `GET` | `/api/orders/:orderId` | P1 | Read one accessible order by identifier |
| `PATCH` | `/api/orders/:orderId` | P2 | Update permitted customer, item, or status fields |
| `DELETE` | `/api/orders/:orderId` | P3 | Delete an order after authorization and explicit confirmation |

### API Contract Requirements

- Successful account creation MUST return `201` and a safe user representation that excludes the
  password and other secrets.
- Successful order creation MUST return `201`; successful reads and updates MUST return `200`;
  successful deletion MUST return `204` or a documented `200` confirmation response.
- Invalid input MUST return `400` with field-level details where possible.
- Unauthenticated requests MUST return `401`; authenticated users without permission MUST return
  `403`; missing records MUST return `404`.
- Order totals MUST be calculated from validated line items on the server boundary.
- List responses MUST provide stable ordering and enough metadata for pagination when pagination
  is enabled.

## Functional Requirements

- **FR-001**: The system MUST support authenticated staff accounts with unique email addresses.
- **FR-002**: The system MUST validate required fields and business rules on both the form and
  server boundaries.
- **FR-003**: The system MUST allow authorized staff to create, read, update, and delete orders
  according to the priorities and permissions above.
- **FR-004**: An order MUST contain an identifier, customer details, at least one line item,
  quantity and price for each item, calculated total, status, and creation/update timestamps.
- **FR-005**: The system MUST preserve order correctness when validation fails or a request fails.
- **FR-006**: The system MUST prevent unauthorized users from accessing or modifying protected
  customer and order data.
- **FR-007**: The interface MUST be keyboard accessible, provide labels for form controls, and
  communicate loading, success, empty, and error states.
- **FR-008**: The implementation MUST use Next.js App Router, TypeScript strict mode, and
  Tailwind CSS according to the project constitution.
- **FR-009**: New behavioral code MUST avoid `any` and MUST include automated tests when the
  repository test runner is available.

## Key Entities

- **User**: An authorized Orderly account with an identifier, name, unique email, role, and
  authentication metadata. Passwords are never returned by the API.
- **Order**: A customer request managed by the business, with an identifier, customer details,
  line items, calculated total, status, owner/business scope, and timestamps.
- **OrderItem**: A line item containing a product description, unit price, and positive quantity.
- **OrderStatus**: A controlled value representing the order's operational stage, initially
  `pending`, `confirmed`, `preparing`, `ready`, `completed`, or `cancelled`.

## Edge Cases

- Duplicate or differently cased email addresses during sign-up.
- Passwords that fail the published minimum requirements.
- Empty order item lists, zero or negative quantities, negative prices, and malformed identifiers.
- Very long customer names, notes, or item descriptions.
- Concurrent updates to the same order.
- Requests for records belonging to another business or user scope.
- Expired sessions, network failures, duplicate submissions, and unavailable persistence.
- Deleting an order that has already been completed or cancelled.

## Implementation Priority

1. **P1 - Foundation and core flow**: Define domain types and validation, establish authentication
   and sign-up, implement order creation, implement order list/detail reads, and add accessible
   loading, empty, success, and error states.
2. **P2 - Operational correction**: Implement permission-aware order updates, status transitions,
   server-side total calculation, and tests for validation and concurrent or stale updates.
3. **P3 - Data hygiene**: Implement explicit-confirmation deletion, manager authorization, audit
   considerations, and tests for not-found and forbidden cases.
4. **P4 - Usability refinement**: Add search, status filters, pagination, responsive refinements,
   and performance improvements after the core workflows are reliable.

## Success Criteria

### Measurable Outcomes

- **SC-001**: An authorized staff member can create a valid order and see it in the active-order
  list in fewer than 2 minutes during normal operation.
- **SC-002**: At least 95% of valid create and update submissions preserve the exact submitted
  customer and item data in end-to-end testing.
- **SC-003**: Invalid create and update requests never create or mutate an order in automated tests.
- **SC-004**: Every protected endpoint returns the documented authorization response for missing,
  invalid, expired, and insufficient credentials.
- **SC-005**: A keyboard-only user can complete sign-up, create an order, read its details, and
  cancel a deletion without being blocked by an inaccessible control.
