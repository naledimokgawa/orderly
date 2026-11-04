# Project Overview

- Internal web app for small food businesses to manage customer orders.
- Team:
  - Raymond Mukonda
  - Jerson Jose Manuel Porras Rosales
  - Simond Mukonda

![Project Structure](../image.png)

## Week 03 Meeting Notes

### Design Theme & Branding

- Color Palette (Tailwind CSS)
  - Primary: emerald-600 → buttons, highlights
  - Secondary: amber-500 → accents, alerts
  - Neutral: gray-100, gray-700 → backgrounds, text
  - Success: green-500 → confirmed/prepared orders
  - Error: red-500 → validation errors, failed actions

### Typography

- Headings: Inter (bold, clean sans-serif)
- Body: Roboto or Nunito (friendly, readable)
- Imported via Google Fonts and applied with Tailwind’s font-sans.

### Layout & Spacing

- Global Layout: AppLayout with fixed Header + Footer, scrollable main content.
- Spacing: Use Tailwind multiples of 4 (p-4, p-6, gap-4) consistently.
- UI Library: Tailwind utility classes; optional shadcn/ui for modals, buttons, and accessibility.

## Document Plan – Week 04

### Team Assignment Summary

- **Raymond Mukonda**
  - Signup & Login Pages (AuthForm)
  - Order Detail Page
  - Backend Order CRUD API

- **Jerson Jose Manuel Porras Rosales**
  - Order Creation Page (OrderForm)
  - Reusable Components (Header, Footer, ConfirmationModal)

- **Simond Mukonda**
  - Order List Page (OrderCard)
  - Backend Authentication API

### Dependencies

- Shared **TypeScript types** for `User`, `Order`, `OrderItem` must be defined before API integration.
- **AuthForm** must be completed before testing protected routes.
- **OrderForm** depends on backend `POST /api/orders`.
- **OrderCard** depends on backend `GET /api/orders`.
- **ConfirmationModal** depends on backend `DELETE /api/orders/:id`.

### Async Coordination

- **Daily check-in cadence:** Each member posts progress + blockers in Teams by 6 PM.
- **Pull request workflow:**

- Create branch → commit → push → open PR → teammate review → merge into `main`.
- **Milestone tracking:** All Week 04 issues attached to the `Week 04` milestone.
- **Board workflow:** Issues move through **To Do → In Progress → Done** columns.


