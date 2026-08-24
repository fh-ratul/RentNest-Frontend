# API Integration Map — RentNest Frontend

This document maps every frontend route/component to the backend endpoint(s) it consumes, per Assignment 5's mandatory requirement #1.

**Repo:** https://github.com/fh-ratul/RentNest-Frontend

**Backend base URL:** set via `BACKEND_API_URL` in Vercel/`.env.local` (server-only, never exposed to the browser — all requests to the backend happen from Next.js Server Components / Server Actions, not client-side `fetch`).

---

## Architecture note

This frontend does **not** call the backend directly from the browser. Every request goes through a Next.js Server Component or Server Action first, which forwards the `accessToken` cookie to the backend as a `Cookie` header. This keeps the access token httpOnly and unreadable by client-side JS, and avoids CORS entirely since the backend only ever sees server-to-server requests.

---

## Auth

| Frontend | File | Backend Endpoint |
|---|---|---|
| `/register` | `app/(authGroup)/_actions/authActions.ts` → `registerAction` | `POST /api/auth/register` |
| `/login` | `app/(authGroup)/_actions/authActions.ts` → `loginAction` | `POST /api/auth/login` |
| Every layout (auth check) | `service/getMe.ts` | `GET /api/auth/me` |
| Logout (navbar / sidebar) | `service/logout.ts` | *(clears cookies locally — stateless JWT, no backend call)* |
| Silent token refresh | `service/refreshToken.ts`, `proxy.ts` | `POST /api/auth/refresh-token` |

## User Settings

| Frontend | File | Backend Endpoint |
|---|---|---|
| `/dashboard/settings` — Update profile | `app/(dashboardGroup)/dashboard/settings/_actions/settingsActions.ts` → `updateProfileAction` | `PATCH /api/users/updateMe` |
| `/dashboard/settings` — Change password | `app/(dashboardGroup)/dashboard/settings/_actions/settingsActions.ts` → `changePasswordAction` | `PATCH /api/users/change-password` |

## Public Properties

| Frontend | File | Backend Endpoint |
|---|---|---|
| `/` — Featured listings | `app/page.tsx` → `getProperties()` | `GET /api/properties?limit=6` |
| `/properties` — Browse + filters | `app/properties/_actions/propertyActions.ts` → `getProperties()` | `GET /api/properties?city=&categoryId=&minPrice=&maxPrice=&search=` |
| `/properties` — Category filter dropdown | `app/properties/_actions/propertyActions.ts` → `getCategories()` | `GET /api/categories` |
| `/properties/[id]` — Property detail | `app/properties/_actions/propertyDetailActions.ts` → `getPropertyById()` | `GET /api/properties/:id` |

## Rental Requests (Tenant)

| Frontend | File | Backend Endpoint |
|---|---|---|
| `/properties/[id]` — Request to Rent form | `app/properties/_actions/rentalRequestActions.ts` → `createRentalRequestAction` | `POST /api/rentals` |
| `/dashboard/tenant` — My requests list | `app/(dashboardGroup)/dashboard/tenant/_actions/rentalActions.ts` → `getMyRentals()` | `GET /api/rentals` |
| `/dashboard/tenant/requests/[id]/pay`, `/review` | `app/(dashboardGroup)/dashboard/tenant/_actions/rentalActions.ts` → `getRentalById()` | `GET /api/rentals/:id` |

## Landlord — Property Management

| Frontend | File | Backend Endpoint |
|---|---|---|
| `/dashboard/landlord/properties` — My listings | `app/(dashboardGroup)/dashboard/landlord/_actions/propertyActions.ts` → `getMyProperties()` | `GET /api/landlord/properties` |
| `/dashboard/landlord/properties/new` — Create | `app/(dashboardGroup)/dashboard/landlord/_actions/propertyActions.ts` → `createPropertyAction` | `POST /api/landlord/properties` |
| `/dashboard/landlord/properties/[id]/edit` — Update | `app/(dashboardGroup)/dashboard/landlord/_actions/propertyActions.ts` → `updatePropertyAction` | `PUT /api/landlord/properties/:id` |
| Delete (confirm dialog on properties grid) | `app/(dashboardGroup)/dashboard/landlord/_actions/propertyActions.ts` → `deletePropertyAction` | `DELETE /api/landlord/properties/:id` |
| Edit form pre-fill | `app/(dashboardGroup)/dashboard/landlord/_actions/propertyActions.ts` → `getPropertyByIdForEdit()` | `GET /api/properties/:id` |

## Landlord — Request Management

| Frontend | File | Backend Endpoint |
|---|---|---|
| `/dashboard/landlord/requests` — Incoming requests | `app/(dashboardGroup)/dashboard/landlord/_actions/requestActions.ts` → `getLandlordRequests()` | `GET /api/landlord/requests` |
| Approve / Reject / Mark Completed (optimistic table) | `app/(dashboardGroup)/dashboard/landlord/_actions/requestActions.ts` → `updateRequestStatus()` | `PATCH /api/landlord/requests/:id` |

## Payments (Stripe)

| Frontend | File | Backend Endpoint |
|---|---|---|
| "Pay Now" button on approved requests | `app/(dashboardGroup)/dashboard/tenant/_actions/paymentActions.ts` → `createPaymentAction()` | `POST /api/payments/create` |
| `/payments/success` — Confirm after Stripe redirect | `app/payments/_actions/confirmPaymentActions.ts` → `confirmPayment()` | `POST /api/payments/confirm` |
| `/dashboard/tenant` — Payment history | `app/(dashboardGroup)/dashboard/tenant/_actions/paymentActions.ts` → `getMyPayments()` | `GET /api/payments` |

## Reviews

| Frontend | File | Backend Endpoint |
|---|---|---|
| `/dashboard/tenant/requests/[id]/review` | `app/(dashboardGroup)/dashboard/tenant/_actions/reviewActions.ts` → `createReviewAction` | `POST /api/reviews` |

## Admin

| Frontend | File | Backend Endpoint |
|---|---|---|
| `/dashboard/admin` — Overview stats | `app/(dashboardGroup)/dashboard/admin/_actions/adminActions.ts` (all three reads) | `GET /api/admin/users`, `GET /api/admin/properties`, `GET /api/admin/rentals` |
| `/dashboard/admin/users` — Ban/unban | `app/(dashboardGroup)/dashboard/admin/_actions/adminActions.ts` → `getAllUsers()`, `updateUserStatusAction()` | `GET /api/admin/users`, `PATCH /api/admin/users/:id` |
| `/dashboard/admin/properties` — Moderation view | `app/(dashboardGroup)/dashboard/admin/_actions/adminActions.ts` → `getAllAdminProperties()` | `GET /api/admin/properties` |
| `/dashboard/admin/rentals` — Moderation view | `app/(dashboardGroup)/dashboard/admin/_actions/adminActions.ts` → `getAllAdminRentals()` | `GET /api/admin/rentals` |

---

## Client-Side Validation

Registration, login, and property create/edit forms validate input with Zod (`lib/validations/`) inside their Server Actions before any backend call is made. Invalid submissions return field-level errors rendered inline under each input — no round trip to the backend for basic validation failures. The backend's own Zod schemas remain the final authority (defense in depth); frontend validation is a UX layer, not a replacement.

## Error Handling

- `app/error.tsx` — global error boundary (500-class failures)
- `app/(dashboardGroup)/error.tsx` — scoped boundary so a dashboard-section crash doesn't blank the whole app
- `app/not-found.tsx` — 404 page, also used by `proxy.ts` on role-mismatched route access
- All Server Actions return `{ success, message, fieldErrors? }`; failures surface as toast notifications (`sonner`) or inline field errors, never a raw unhandled exception

## Role-Based Route Protection

`proxy.ts` (project root) intercepts every request except static assets and API routes. It reads the `accessToken`/`refreshToken` cookies, verifies the JWT, silently refreshes an expired access token via `/api/auth/refresh-token` when possible, and redirects:
- Unauthenticated users hitting a protected route → `/login?redirectTo=<original path>`
- Authenticated users hitting `/login` or `/register` → their role's dashboard
- Role-mismatched dashboard access (e.g. a TENANT hitting `/dashboard/admin`) → `/not-found`
