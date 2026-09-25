# Mother Project Development Journey

## Overview

The Mother Project was developed as a production-grade backend foundation that can later be extended into:

- LMS
- E-Commerce
- ERP
- CRM
- HRM
- Inventory Management
- SaaS Applications

---

# Phase 1: Project Initialization

## Dependencies

```bash
npm install express cors dotenv mongoose
```

## Dev Dependencies

```bash
npm install -D typescript
npm install -D tsx
npm install -D @types/node
npm install -D @types/express
npm install -D @types/cors
```

## Project Setup

Created:

```text
src/
├── app.ts
├── server.ts
```

Configured:

```text
TypeScript
Express
Environment Variables
```

## Outcome

```text
✅ Express Server Setup

✅ TypeScript Configuration

✅ Project Foundation Established
```

---

# Phase 2: MongoDB Integration

## Dependencies

```bash
mongoose
dotenv
```

## Setup

Created:

```text
src/database/db.ts
```

Implemented:

```text
MongoDB Connection

Environment Configuration
```

## Outcome

```text
✅ MongoDB Connected

✅ Data Layer Ready
```

---

# Phase 3: Scalable Architecture

## Folder Structure

```text
src/

├── configs/
├── database/
├── errors/
├── middlewares/
├── modules/
├── routes/
├── utils/
```

## Core Utilities

Implemented:

```text
AppError

Global Error Handler

catchAsync

sendResponse
```

## Outcome

```text
✅ Scalable Project Structure

✅ Centralized Error Handling

✅ Reusable Utilities
```

---

# Phase 4: Authentication Module

## Dependencies

```bash
npm install bcrypt
npm install jsonwebtoken
npm install cookie-parser
```

## Dev Dependencies

```bash
npm install -D @types/bcrypt
npm install -D @types/jsonwebtoken
npm install -D @types/cookie-parser
```

## Features Implemented

### Authentication

```text
Register

Login

Logout

Refresh Token

Get Me
```

### Security

```text
Password Hashing

JWT Authentication

Refresh Tokens

HttpOnly Cookies
```

## Outcome

```text
✅ Authentication System

✅ JWT Authentication

✅ Refresh Token Flow

✅ Secure Cookie Support
```

---

# Phase 5: User Module

## Features Implemented

```text
Get All Users

Get User By ID

Update User

Block User

Soft Delete User
```

## User Roles

```text
ADMIN

USER
```

## User Status

```text
ACTIVE

BLOCKED
```

## Outcome

```text
✅ User Management Module
```

---

# Phase 5.5: Authorization (RBAC)

## Authentication Middleware

Implemented:

```text
JWT Verification

User Injection Into Request
```

## Authorization Middleware

Implemented:

```text
Role-Based Access Control
```

Roles:

```text
ADMIN

USER
```

## Outcome

```text
✅ RBAC Implemented

✅ Protected Routes Enabled
```

---

# Phase 6: Request Validation

## Dependencies

```bash
npm install zod
```

## Implemented

### Validation Middleware

```text
validateRequest
```

### Validation Schemas

```text
Register Validation

Login Validation
```

### Validation Error Formatting

```text
Structured Error Responses
```

## Outcome

```text
✅ Request Validation

✅ Cleaner Error Handling

✅ Better API Reliability
```

---

# Phase 7: Swagger Foundation

## Dependencies

```bash
npm install swagger-ui-express
npm install swagger-jsdoc
```

## Dev Dependencies

```bash
npm install -D @types/swagger-ui-express
```

## Implemented

```text
Swagger Configuration

/api-docs Endpoint
```

## Outcome

```text
✅ Swagger UI

✅ API Documentation Foundation
```

---

# Redis Attempt (Deferred)

## Dependency

```bash
npm install redis
```

## Implemented

```text
redis.ts

connectRedis()
```

## Status

```text
Redis Infrastructure Unavailable

Deferred Until Docker Phase
```

## Outcome

```text
⏸ Deferred
```

---

# Phase 8: Integration Testing

## Initial Attempt

### Planned Stack

```text
Jest

ts-jest

Supertest
```

### Problem Encountered

```text
TypeScript 7

↓

ts-jest Compatibility Issues
```

---

## Final Testing Stack

### Dependencies

```bash
npm install -D vitest
npm install -D supertest
npm install -D @types/supertest
```

### Configuration

Created:

```text
vitest.config.ts

src/tests/setup.ts
```

Implemented:

```text
Global MongoDB Test Setup
```

---

# Integration Tests Implemented

## Authentication Tests

### Register Validation

```text
Invalid Email

→ 400
```

### Login Validation

```text
Invalid Email

→ 400
```

### Duplicate User

```text
Existing User

→ 409
```

### Wrong Password

```text
Wrong Password

→ 401
```

### Blocked User Login

```text
Blocked User

→ 403
```

### Successful Login

```text
Valid Credentials

→ 200
```

---

## Authorization Tests

### Protected Route Without Token

```text
GET /users

→ 401
```

---

## RBAC Tests

### USER Forbidden

```text
USER

↓

GET /users

↓

403
```

### ADMIN Allowed

```text
ADMIN

↓

GET /users

↓

200
```

---

## User Module Tests

### Get User By ID

```text
Valid User ID

→ 200
```

### Invalid User ID

```text
abc

→ 400
```

### Non-Existent User ID

```text
507f1f77bcf86cd799439011

→ 404
```

### Update User

```text
PATCH User

→ 200
```

---

# Critical Testing Lessons Learned

## Business Rule Verification

Discovered:

```text
Blocked User

↓

Could Still Login
```

Implemented:

```ts
if (user.status === USER_STATUS.BLOCKED)
```

Result:

```text
Blocked User Login

→ 403
```

---

## Test Isolation

Discovered:

```text
Tests Can Modify Shared Database State
```

Example:

```text
Block User Test

↓

Changed User Status

↓

Affected Other Tests
```

Lesson:

```text
Tests Should Be Independent

Tests Should Not Share Mutable Test Data
```

---

## Integration Testing Outcome

Verified:

```text
✅ Authentication

✅ Authorization

✅ RBAC

✅ Validation

✅ Global Error Handling

✅ MongoDB Queries

✅ Business Logic

✅ JWT Protection
```

---

# Phase 9: Core Unit Testing

## Purpose

The purpose of this phase was to learn and implement core unit-testing concepts without spending excessive time testing trivial functions.

---

## Unit Tests Implemented

### createToken()

Verified:

```text
JWT Generation

Returns Valid JWT String
```

### verifyToken()

Verified:

```text
Valid Token Verification

Invalid Token Handling
```

---

## Outcome

```text
✅ Unit Testing Concepts Learned

✅ Authentication Utilities Tested

✅ Pure Function Testing Implemented
```

---

## Unit Testing Strategy

Future unit testing will follow:

```text
New Feature

↓

Meaningful Utility

↓

Targeted Unit Tests
```

Instead of:

```text
Testing Every Function
```

The goal is:

```text
Maximum Learning

Maximum Business Value

Minimum Maintenance Cost
```

---

# Testing Statistics

## Integration Tests

```text
15
