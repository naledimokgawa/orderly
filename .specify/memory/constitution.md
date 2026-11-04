<!--
Sync Impact Report
- Version change: template -> 1.1.0
- Modified principles: all placeholder principles replaced with Orderly-specific rules
- Added sections: Technical Constraints; Development Workflow and Collaboration
- Removed sections: none
- Templates requiring updates: pending; Spec Kit templates are not currently available in this repository
- Follow-up TODOs: add a test runner and align Spec Kit plan, spec, task, and command templates
-->
# Orderly - Small Business Order Manager Constitution

## Core Principles

### I. TypeScript Safety
Orderly MUST use TypeScript in strict mode. New code MUST NOT use `any`; unknown values MUST
be narrowed or validated before use. Types MUST describe domain data such as customers, orders,
items, and statuses, and shared types MUST be defined once and reused. Type assertions require
a local justification and MUST NOT be used to bypass a type error.

### II. Next.js App Router Patterns
The required application stack is Next.js App Router with TypeScript and Tailwind CSS. Routes
MUST follow file-based routing under `app/`. Components MUST remain server components by default;
`"use client"` MUST be added only when browser APIs, state, effects, or event handlers require
it. Server-only data access and secrets MUST stay on the server, and client components MUST
receive only the data they need.

### III. Utility-First UI
Styling MUST use Tailwind utility classes and existing project conventions. Custom CSS MUST NOT
be introduced when Tailwind utilities can express the requirement; custom CSS is permitted only
for a necessary global rule, animation, third-party integration, or capability unavailable in
Tailwind. Interfaces MUST be responsive, keyboard accessible, semantically structured, and
designed to reduce errors during order entry and fulfillment.

### IV. Testable Order Workflows
Every new order workflow, state transition, validation rule, and data transformation MUST have
automated coverage once a test runner is available. Tests MUST include the success path and
important invalid or boundary cases. Until a test runner is configured, each behavioral change
MUST include an executable verification and the missing automated coverage MUST be recorded for
follow-up. Every change MUST pass `npm run lint` and `npm run build` before integration.

### V. Order Accuracy and Data Privacy
Order quantities, prices, customer details, and statuses MUST have one clear source of truth per
feature. State changes MUST be deliberate and visibly communicated to the user. The application
MUST collect and expose only data required for the documented business workflow; secrets and
sensitive customer data MUST NOT be placed in public assets, client bundles, or logs.

## Naming Conventions

Files and folders MUST use lowercase kebab-case unless a framework convention requires another
form. React components and component files MUST use PascalCase when they represent a component.
Functions, variables, props, and hooks MUST use camelCase; hooks MUST begin with `use`. Types,
interfaces, and enums MUST use PascalCase. Constants MUST use descriptive camelCase unless they
are module-level immutable values that conventionally use UPPER_SNAKE_CASE. Names MUST describe
the business concept and MUST NOT use unexplained abbreviations.

## Development Workflow and Collaboration

Work MUST begin with a focused issue or feature description and an observable acceptance
condition. Pull requests MUST be small enough to review, describe the user-visible behavior,
identify validation performed, and call out migration or privacy implications. Contributors MUST
respect existing work, avoid unrelated refactors, and communicate decisions that affect shared
routes, types, or UI conventions. Reviews MUST check TypeScript safety, server/client boundaries,
Tailwind usage, accessibility, tests, and order correctness. Merge conflicts and review feedback
MUST be resolved before integration; no contributor may silently discard another contributor's
changes.

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

This constitution governs feature planning and implementation for Orderly. It takes precedence
over a conflicting local convention unless an exception is documented in the plan and approved
during review. Exceptions MUST state the affected principle, reason, scope, risk, and follow-up
date.

Amendments MUST state the affected principles, rationale, migration impact, and updated version.
Versioning follows semantic rules: MAJOR for incompatible governance changes or removed
principles, MINOR for new principles or materially expanded requirements, and PATCH for
clarifications that do not change obligations. The last amended date MUST be updated for every
approved amendment. Compliance MUST be reviewed during planning and before integration.

**Version**: 1.1.0 | **Ratified**: 2026-09-12 | **Last Amended**: 2026-09-12
