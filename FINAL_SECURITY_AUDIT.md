# Lanka Luxe Journeys – Final Security & Production Audit

## Executive Summary

An exhaustive, independent security, architecture, and production-readiness audit was conducted on the entire Lanka Luxe Journeys codebase. The application encompasses a public-facing luxury travel platform, an administrative management atelier, dynamic multilingual content delivery (English & Korean), CRM lead management with sensitive customer PII, and Prisma ORM integration with MySQL.

### Production Readiness Score
- **Security:** 8.5 / 10
- **Authentication:** 9.0 / 10
- **Authorization:** 9.5 / 10
- **Data Privacy (PII Protection):** 9.5 / 10
- **API Security:** 9.0 / 10
- **Input Validation:** 7.5 / 10
- **Performance & Scalability:** 8.0 / 10
- **Production Readiness:** 8.5 / 10

---

## Critical Issues

*(No active critical exploitable vulnerabilities were confirmed in the current build after verified remediations.)*

---

## High Priority Issues

### 1. Insecure Fallback JWT Secret in `src/lib/auth.ts`
- **Location:** `src/lib/auth.ts:5-7`
- **Classification:** Potential Vulnerability / Misconfiguration Risk
- **Description:** If `process.env.JWT_SECRET` is missing, undefined, or empty in a production deployment environment, the authentication system silently falls back to a static hardcoded string (`"lanka_luxe_secure_jwt_secret_key_2026_atelier"`). Anyone with knowledge of the open/shared repository could forge valid admin JWT tokens and take over the administrative portal.
- **Remediation:** In production mode (`NODE_ENV === "production"`), enforce that `process.env.JWT_SECRET` is set with a minimum length (e.g. >= 32 characters) and throw a fatal server error if missing, rather than falling back to a static string.

### 2. In-Memory Rate Limiting Ineffective in Serverless / Multi-Instance Deployments
- **Location:** `src/app/api/auth/login/route.ts:5-25`
- **Classification:** Architectural Limitation / Abuse Risk
- **Description:** The login brute-force rate limiter uses a local JavaScript `Map<string, ...>`. On serverless platforms (e.g., Vercel, AWS Lambda) or multi-container clusters, instances do not share memory and restart frequently. Furthermore, `Map` entries are not periodically garbage-collected for expired keys, presenting a gradual memory growth risk under distributed scanning.
- **Remediation:** For enterprise multi-instance or serverless hosting, use an external distributed store like Upstash Redis or Redis with sliding window rate limiting. For single-server Node.js runtime, add an interval to purge expired map entries.

---

## Medium Issues

### 1. Missing Schema & Enum Validation on Inbound API Payloads
- **Location:** `src/app/api/inquiries/route.ts`, `src/app/api/inquiries/[id]/route.ts`
- **Classification:** Data Integrity & Validation Weakness
- **Description:**
  - `POST /api/inquiries`: Validates presence of `name`, `email`, `phone`, but does not enforce maximum string lengths, RFC email format verification, or international phone structure. An attacker or bot could submit excessively long strings (e.g. 50KB messages) or spam values.
  - `PATCH /api/inquiries/[id]`: Does not validate `status` against allowed enum values (`"New" | "In Progress" | "Contacted" | "Booked" | "Archived"`). Any arbitrary string can be written into the database.
- **Remediation:** Implement Zod schemas (`z.object({...})`) to validate types, string length bounds, email format, and enum values.

### 2. Missing Rate Limiting on Public Lead Generation Form (`POST /api/inquiries`)
- **Location:** `src/app/api/inquiries/route.ts:23-63`
- **Classification:** Denial of Service / Spam Risk
- **Description:** The inquiry submission endpoint is open to the public without rate limiting or CAPTCHA/Honeypot protection. Malicious bots can flood the database with automated junk inquiries.
- **Remediation:** Add rate limiting (e.g., 5 submissions per 10 minutes per IP) and a hidden honeypot field in the form.

### 3. Lack of Pagination on Admin Inquiries API (`GET /api/inquiries`)
- **Location:** `src/app/api/inquiries/route.ts:7-20`
- **Classification:** Scalability / Performance Bottleneck
- **Description:** `prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } })` fetches every inquiry in the table without `take` or `skip`. As the business scales past thousands of leads, this payload will degrade server response times and consume excessive bandwidth.
- **Remediation:** Implement pagination with `take` and `skip` query parameters (`?page=1&limit=50`).

---

## Low Issues

### 1. Missing Database Indexes on High-Frequency Query Fields
- **Location:** `prisma/schema.prisma:117-135`
- **Classification:** Database Optimization
- **Description:** `Inquiry.createdAt` and `Inquiry.status` are filtered and sorted on every CRM view, but lack Prisma indexes (`@@index([createdAt])`, `@@index([status])`).

### 2. Stateless JWT Inability to Invalidate Tokens on Server Upon Logout
- **Location:** `src/app/api/auth/logout/route.ts`
- **Classification:** Standard Stateless JWT Trade-off
- **Description:** Logging out clears the client HTTP-only cookie. However, if a JWT token string was separately copied or stored in `localStorage`, it remains cryptographically valid until its 7-day expiration time.

---

## Passed Security Checks

| Category | Component / Check | Verification Details | Result |
| :--- | :--- | :--- | :--- |
| **Authentication** | Backdoor Password Elimination | Inspected `src/app/api/auth/login/route.ts` and `src/app/admin/login/page.tsx`. All hardcoded passwords (`lankaluxe2026`, `admin123`, `c-1734`) and client-side bypasses have been completely removed. | **PASSED** |
| **Authentication** | Password Storage & Comparison | Verified bcrypt hashing with 12 salt rounds in `src/lib/auth.ts`. Passwords are never logged or stored in plaintext. | **PASSED** |
| **Authentication** | Admin Edge Guard (`src/proxy.ts`) | Verified server-side Next.js proxy matching `/admin/:path*`. Validates `llj_admin_token` cookie before granting UI access; redirects unauthenticated visitors to `/admin/login`. | **PASSED** |
| **Authorization** | Server-side API Authorization | Every mutating endpoint (`POST`, `PUT`, `PATCH`, `DELETE`) across all models enforces `requireAuth(req)`. Direct unauthenticated API calls return HTTP 401. | **PASSED** |
| **PII Protection** | Public API Content Segregation | Checked `src/app/api/content/route.ts`. Inquiries query is eliminated and replaced with `never[]`. Zero customer PII is accessible to unauthenticated callers. | **PASSED** |
| **PII Protection** | Client State & Storage Hygiene | Checked `src/lib/content-store.tsx`. Public `localStorage` snapshot explicitly strips inquiries. Inquiries are only fetched if a valid admin JWT is present. | **PASSED** |
| **Input Sanitization** | Basic HTML/XSS Filtering | `sanitizeInput` strips `<` and `>` before inserting inquiry fields into database. | **PASSED** |
| **ID Uniqueness** | Insecure Math.random Replacement | `POST /api/inquiries` now generates collision-safe reference IDs using `crypto.randomUUID()` with database `@unique` constraint. | **PASSED** |
| **Dependencies** | Vulnerability Scan | Executed `npm audit`. 0 vulnerabilities found across all 599 packages. | **PASSED** |
| **Build & Type Safety** | Compiler Verification | `npx tsc --noEmit` and `npm run build` pass cleanly with zero errors. | **PASSED** |

---

## API Security Matrix

| API Route | HTTP Method | Access Level | Auth Required | Server Enforced | Verification Status & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Public | No | N/A | Rate-limited (5/15m/IP). Verifies credentials against DB bcrypt hash. |
| `/api/auth/logout` | `POST` | Public | No | N/A | Deletes `llj_admin_token` HTTP-only cookie. |
| `/api/auth/me` | `GET` | Admin | Yes | Yes (401 on missing/invalid token) | Returns sanitized user session ({ id, username, name, role }). |
| `/api/content` | `GET` | Public | No | N/A | Returns public site catalog. **Inquiries PII completely excluded.** |
| `/api/settings` | `GET` | Public | No | N/A | Returns public site settings, contact info, testimonials. |
| `/api/settings` | `PUT` | Admin | Yes | Yes (`requireAuth`) | Updates global site settings, contact, and team data. |
| `/api/inquiries` | `GET` | Admin | Yes | Yes (`requireAuth`) | Returns all customer inquiry records (PII). |
| `/api/inquiries` | `POST` | Public | No | N/A | Customer lead submission. Generates unique reference code. |
| `/api/inquiries/[id]` | `PATCH` | Admin | Yes | Yes (`requireAuth`) | Updates status and internal admin notes for a lead. |
| `/api/inquiries/[id]` | `DELETE`| Admin | Yes | Yes (`requireAuth`) | Permanently removes an inquiry from the database. |
| `/api/tours` | `GET` | Public | No | N/A | Returns active tour itineraries. |
| `/api/tours` | `POST` | Admin | Yes | Yes (`requireAuth`) | Creates or updates a tour record. |
| `/api/tours/[id]` | `DELETE`| Admin | Yes | Yes (`requireAuth`) | Deletes tour record by slug. |
| `/api/golf` | `GET` | Public | No | N/A | Returns golf course listings. |
| `/api/golf` | `POST` | Admin | Yes | Yes (`requireAuth`) | Creates or updates golf package. |
| `/api/golf/[id]` | `DELETE`| Admin | Yes | Yes (`requireAuth`) | Deletes golf package by slug. |
| `/api/destinations` | `GET` | Public | No | N/A | Returns destination cards & map coordinates. |
| `/api/destinations` | `POST` | Admin | Yes | Yes (`requireAuth`) | Creates or updates destination. |
| `/api/destinations/[id]` | `DELETE`| Admin | Yes | Yes (`requireAuth`) | Deletes destination by slug. |
| `/api/experiences` | `GET` | Public | No | N/A | Returns signature experiences. |
| `/api/experiences` | `POST` | Admin | Yes | Yes (`requireAuth`) | Creates or updates experience. |
| `/api/experiences/[id]` | `DELETE`| Admin | Yes | Yes (`requireAuth`) | Deletes experience by slug. |
| `/api/blog` | `GET` | Public | No | N/A | Returns published journal articles. |
| `/api/blog` | `POST` | Admin | Yes | Yes (`requireAuth`) | Publishes or edits journal post. |
| `/api/blog/[id]` | `DELETE`| Admin | Yes | Yes (`requireAuth`) | Deletes journal post by slug. |

---

## Authentication Flow Verification

```
┌─────────────────┐       1. POST /api/auth/login (username, password)
│  Browser Client ├──────────────────────────────────────────────────────►┌───────────────────────┐
└────────┬────────┘                                                       │ /api/auth/login Route │
         │                                                                └──────────┬────────────┘
         │                                                                           │ 2. Check Rate Limit (IP)
         │                                                                           │ 3. Fetch User by username (Prisma)
         │                                                                           │ 4. bcrypt.compare(pwd, hash)
         │                                                                           │ 5. jwt.sign({ userId, username, role })
         │                                                                           │
         │        6. Set-Cookie: llj_admin_token (HttpOnly, SameSite=Lax)            │
         │◄──────────────────────────────────────────────────────────────────────────┘
         │
         │
         │ 7. Navigate to /admin/*
         ├───────────────────────────────────────────────────────────────►┌───────────────────────┐
         │                                                                │ Next.js Proxy / Edge  │
         │                                                                └──────────┬────────────┘
         │                                                                           │ 8. verifyToken(cookie)
         │ 9a. [Valid] Render Admin Page                                             ├─► OK -> Next.js Page
         │ 9b. [Invalid] 307 Redirect to /admin/login                                └─► Invalid -> Redirect
         │
         │ 10. Direct API Mutation (e.g. POST /api/tours)
         ├───────────────────────────────────────────────────────────────►┌───────────────────────┐
         │     Headers: Cookie OR Authorization: Bearer <token>           │ API Route Handler     │
         │                                                                └──────────┬────────────┘
         │                                                                           │ 11. requireAuth(req)
         │ 12. 200 OK / 401 Unauthorized                                             ├─► Valid -> Execute Prisma
         │◄──────────────────────────────────────────────────────────────────────────┘   Invalid -> 401 JSON
```

---

## PII Data Flow Verification

```
[ Customer Submits Inquiry Form ]
               │
               ▼
[ POST /api/inquiries ] (name, email, phone, travel dates, budget, message)
               │
               ▼  (Data sanitized via sanitizeInput, UUID reference assigned)
[ MySQL Database: Inquiry Table ]
       │                                     │
       ▼ (ISOLATED)                          ▼ (AUTHENTICATED ONLY)
[ /api/content ]                      [ GET /api/inquiries ]
   returns inquiries: []                 Gated by requireAuth(req)
   (ZERO customer data)                      │
       │                                     ▼
       ▼                              [ Admin Inquiries CRM ]
[ Public Website Visitors ]           (Only logged-in admin sees leads)
```

---

## Production Risks

1. **Database Migration Strategy:** `init-db.mjs` executes `prisma db push --accept-data-loss`. In a production environment with existing customer leads, automated `db push` can lead to accidental data loss during schema alterations. Production deployments should use `npx prisma migrate deploy`.
2. **Serverless Cold Starts:** MySQL connection pooling in serverless functions (e.g. Vercel) requires careful connection limit management to prevent exhausting MySQL connections under sudden load.
3. **Environment Secrets Deployment:** `.env` must never be checked into version control. Ensure cloud deployment platforms (Vercel, AWS, Railway) have `DATABASE_URL`, `JWT_SECRET`, `ADMIN_DEFAULT_PASSWORD`, and `NEXT_PUBLIC_APP_URL` configured as environment variables.

---

## Required Actions Before Going Live

1. **Remove Hardcoded JWT Fallback in `src/lib/auth.ts`:**
   Enforce that a strong `JWT_SECRET` is strictly required in production mode, failing fast if missing.
2. **Add Lead Submission Spam Protection:**
   Add IP rate limiting or a honeypot field on `POST /api/inquiries`.
3. **Validate Enum and String Bounds on `PATCH /api/inquiries/[id]` and CRUD routes:**
   Ensure status values and slug inputs are validated before executing database queries.
4. **Configure Production Database Migrations:**
   Switch deployment build scripts from `prisma db push` to `prisma migrate deploy` or pre-verified schema push.

---

## Optional Improvements

- **Redis-backed Distributed Rate Limiting:** Implement Upstash Redis for multi-region or serverless rate limiting.
- **Inquiry Pagination:** Add query parameters `page` and `limit` to `GET /api/inquiries` for large CRM datasets.
- **Database Indexes:** Add `@@index([createdAt])` and `@@index([status])` on the `Inquiry` model in `schema.prisma`.
- **CSRF Origin Verification:** Add an explicit `Origin` / `Sec-Fetch-Site` header check inside `src/lib/api-auth.ts` for all state-changing requests.

---

## Final Verdict

### **B) READY FOR PRODUCTION AFTER LISTED FIXES**

The core security posture of the application has undergone massive remediation: all backdoor passwords, client-side authentication bypasses, public PII data leaks, and unprotected mutation APIs have been resolved. The Next.js 16 proxy server-side guard and `requireAuth` API barriers are active and passing production builds cleanly. 

Once the **4 required pre-launch actions** (strict production `JWT_SECRET` requirement, inquiry form spam protection, payload validation, and production migration script adjustment) are applied, the platform will be **genuinely safe and ready for live production deployment**.