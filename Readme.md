# Application Architecture & Route Flow

This document explains the flow of the application in detail, covering routes, controllers, services, middlewares, and utility functions in order.

## 1. Auth Module (`/auth`)

The authentication module handles user signup (with OTP verification) and login.

### **POST** `/auth/signup/initiate`
- **Goal:** Start the signup process by sending an OTP to the user's email.
- **Controller:** `initiateSignup` (`controllers/auth.controller.js`)
  - Validates if `email` is present.
  - Calls `initiateSignupService`.
  - Calls `sendEmail` utility to send the OTP.
- **Service:** `initiateSignupService` (`services/auth.service.js`)
  - Checks if user already exists in DB (`User` model).
  - Clears old OTPs for this email.
  - Generates a new OTP using `generateOTP`.
  - Saves OTP to DB (`OTP` model) with expiration.
- **Utilities:**
  - `generateOTP`: Generates a random 6-digit string.
  - `sendEmail`: Uses `nodemailer` to send the OTP.

### **POST** `/auth/signup/verify`
- **Goal:** Verify the OTP and create the user account.
- **Controller:** `verifySignupOtp` (`controllers/auth.controller.js`)
  - Receives `email`, `otp`, and `password`.
  - Calls `verifySignupOtpService`.
  - Returns the created user object.
- **Service:** `verifySignupOtpService` (`services/auth.service.js`)
  - Retrieves the OTP record from DB.
  - Validates OTP (matches and not expired).
  - Hashes the password using `bcrypt`.
  - Creates the new user in the DB (`User` model).
  - Deletes the used OTP.

### **POST** `/auth/login`
- **Goal:** Authenticate existing user and issue a JWT.
- **Controller:** `login` (`controllers/auth.controller.js`)
  - Receives `email` and `password`.
  - Calls `loginService`.
  - Sets the JWT token in an HTTP-only cookie.
- **Service:** `loginService` (`services/auth.service.js`)
  - Finds user by email.
  - Compares password with stored hash using `bcrypt`.
  - Generates a JWT token containing user ID and role.

---

## 2. Artifacts Module (`/artifacts`)

Handles the creation and retrieval of artifacts (posts/items).

### **POST** `/artifacts`
- **Goal:** Create a new artifact.
- **Middleware:** `authMiddleware`
  - checks `req.cookies.token`.
  - Verify token with `jwt.verify`.
  - Attaches decoded user to `req.user`.
- **Controller:** `createArtifact` (`controllers/artifact.controller.js`)
  - Extracts `title`, `content` from body and `userId` from `req.user`.
  - Calls `createArtifactService`.
- **Service:** `createArtifactService` (`services/artifacts.services.js`)
  - Creates a new document in `Artifacts` collection with the author set to the current user.

### **GET** `/artifacts`
- **Goal:** Retrieve artifacts based on permissions.
- **Middleware:**
  1. `authMiddleware`: Ensures user is logged in.
  2. `authorizeRoles("ADMIN", "VIEWER")`: Ensures user has one of these roles.
- **Controller:** `getArtifacts`
  - Calls `getArtifactsService` with `req.user`.
- **Service:** `getArtifactsService`
  - **Logic:**
    - If role is **VIEWER**: Returns only artifacts created by *that* user (`find({ author: userId })`).
    - If role is **ADMIN**: Returns *all* artifacts (`find()`).
  - Populates author details (username, email).

---

## 3. Likes Module (`/likes`)

Handles toggling likes on artifacts.

### **POST** `/likes/toggle/:id`
- **Goal:** Like or unlike a specific artifact.
- **Middleware:** `authMiddleware` (Ensures user is logged in).
- **Controller:** `toggleLike` (`controllers/like.controller.js`)
  - Gets `id` (artifactId) from URL params.
  - Gets `id` (userId) from `req.user`.
  - Calls `togglelikeService`.
- **Service:** `togglelikeService` (`services/like.services.js`)
  - DB Check: Does a like exist for this user + artifact?
  - **If Exists:** Removes the like (Unlike). Returns `{ liked: false }`.
  - **If Not Exists:** Creates a new like (Like). Returns `{ liked: true }`.
  - Updates the total `likeCount` on the artifact (or synchronizes it).

---

# Project Summary

This project is a robust and modular Express.js backend application designed to handle:

1.  **Secure Authentication**: Using OTP-based email verification for signup and JWT (JSON Web Tokens) for managing user sessions via HTTP-only cookies.
2.  **Artifact Management**: Allowing users to create content ("artifacts") and view them based on role-based access control (RBAC). Admin users can view all content, while Viewers can only manage their own.
3.  **Social Interaction**: Implementing a "Like" system that allows users to toggle likes on artifacts, demonstrating handling of relational data and counters in MongoDB.

**Key Technologies:**
-   **Node.js & Express**: Core server framework.
-   **MongoDB & Mongoose**: Database and ODM for schema modeling.
-   **JWT & Bcrypt**: For authentication and security.
-   **Nodemailer**: For sending transactional emails (OTPs).

The architecture follows a clean **Controller-Service** pattern, ensuring separation of concerns:
-   **Controllers** handle HTTP requests and responses.
-   **Services** contain the core business logic.
-   **Models** define the data structure.

