

This document explains the flow of the application in detail, covering routes, controllers, services, middlewares, and utility functions in order.

## 1. Auth Module (`/auth`)

The authentication module handles user signup (with OTP verification) and login.

### **POST** `/auth/signup/initiate` (Public)
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

### **POST** `/auth/signup/verify` (Public)
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

### **POST** `/auth/login` (Public)
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

### **POST** `/artifacts` (Authenticated)
- **Goal:** Create a new artifact.
- **Middleware:** 
  1. `authMiddleware`: Verify token.
  2. `upload.single("file")`: Handle file upload using Multer.
- **Controller:** `createArtifact` (`controllers/artifact.controller.js`)
  - Extracts `title`, `content` from body and `userId` from `req.user`.
  - Passes file information (if any) to service.
  - Calls `createArtifactService`.
- **Service:** `createArtifactService` (`services/artifacts.services.js`)
  - **Phase 1:** Uploads local file to **Cloudinary**.
  - **Phase 2:** Removes temporary local file.
  - **Phase 3:** Creates a new document in `Artifacts` collection with the Cloudinary URL.

### **GET** `/artifacts` (Authenticated)
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

### **POST** `/likes/toggle/:id` (Authenticated)
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

## 4. Chat Module (`/chat`)

Handles messaging between users (backed by Socket.io for real-time).

### **POST** `/chat` (Authenticated)
- **Goal:** Send a new message via HTTP.
- **Middleware:** `authMiddleware`.
- **Controller:** `sendChat` (`controllers/chat.controller.js`)
  - Validates `receiverId` and `message`.
  - Calls `sendChatService`.
- **Service:** `sendChatService` (`services/chat.service.js`)
  - Finds or creates a `Thread` between sender and receiver.
  - Saves the message in `Chat` collection.
  - Updates `lastMessage` in the `Thread`.
  - **★ Update (Name Visibility):** This service now fetches the saved chat message and explicitly populates the `sender` field (specifically the `name` property) before returning it. This ensures that when the message is emitted via Socket.io or returned in the API response, the sender's name is immediately available for display in the frontend UI.

### **GET** `/chat/:threadId` (Authenticated)
- **Goal:** Fetch conversation history.
- **Controller:** `getChatByThread` (`controllers/chat.controller.js`)
  - Calls `getChatByThreadService` with `threadId`.
- **Service:** `getChatByThreadService` (`services/chat.service.js`)
  - Returns messages for the thread, populated with sender details.

---

## 5. Webhook Module (`/webhook`)

Handles external callbacks.

### **POST** `/webhook/test` (Public)
- **Goal:** Receives webhook events (e.g., from GitHub).
- **Controller:** Inline handler in `webhook/webhook.js`.
  - Logs the payload and returns success status.

---

## 6. Cron Jobs & Automation

Automated background tasks using `node-cron`.

### **Archive Old Drafts**
- **File:** `cron/archiveArtifacts.js`
- **Schedule:** Daily at 00:00 (Midnight).
- **Goal:** Maintain database hygiene.
- **Logic:**
  - Finds artifacts with status `DRAFT`.
  - Checks if created more than 30 days ago.
  - Updates status to `ARCHIVED`.

---

# Project Summary

This project is a robust and modular Express.js backend application designed to handle:

1.  **Secure Authentication**: Using OTP-based email verification for signup and JWT (JSON Web Tokens) for managing user sessions via HTTP-only cookies.
2.  **Artifact Management**: Allowing users to create content ("artifacts") and view them based on role-based access control (RBAC). Admin users can view all content, while Viewers can only manage their own.
3.  **Social Interaction**: Implementing a "Like" system that allows users to toggle likes on artifacts, demonstrating handling of relational data and counters in MongoDB.
4.  **Real-time Chat**: One-to-one messaging using **Socket.io** and HTTP fallbacks, organized into threads.
5.  **Media Handling**: Integration with **Cloudinary** for storing artifact attachments (images/PDFs).
6.  **Automation**: Background Cron jobs for maintenance tasks like archiving old drafts.

**Key Technologies:**
-   **Node.js & Express**: Core server framework.
-   **MongoDB & Mongoose**: Database and ODM for schema modeling.
-   **JWT & Bcrypt**: For authentication and security.
-   **Nodemailer**: For sending transactional emails (OTPs).
-   **Socket.io**: Real-time bidirectional event-based communication.
-   **Cloudinary / Multer**: Cloud file storage and multipart form handling.
-   **Node-Cron**: Task scheduling.

The architecture follows a clean **Controller-Service** pattern, ensuring separation of concerns:
-   **Controllers** handle HTTP requests and responses.
-   **Services** contain the core business logic.
-   **Models** define the data structure.

---

## ★ IMPORTANT UPDATE: REAL-TIME SENDER NAME VISIBILITY
**PROBLEM:** Previously, when a message was sent, only the `senderId` was available in the response. This caused the sender's name to be missing in the real-time chat UI until the page was refreshed.

**SOLUTION:** The `sendChatService` has been updated to **EXPLICITLY POPULATE** the `sender` field (specifically the `name`) immediately after saving the message.

**RESULT:**
- The API response and Socket.io event now contain the **FULL USER OBJECT** (including `name`).
- The Frontend can **INSTANTLY DISPLAY** the sender's name ("You" or "Them") without reloading.
--
## CMS CHAT MODULE - FEATURES & LOGIC (English Guide)

### 1. IMPLEMENTED FEATURES
- [x] **Real-time Messaging:** Instant communication using Socket.io.
- [x] **Database Persistence:** All messages are saved in MongoDB so they persist after refresh.
- [x] **User Identification:** User's real 'Name' and 'Email' are displayed instead of ID.
- [x] **Chat History:** Previous chats are loaded when the user returns.
- [x] **One-Click History Load:** Clicking the 'Start Chat' button instantly fetches and displays past conversations between the two users.
- [x] **Typing Indicator:** "Friend is typing..." feature added.
- [x] **Room-Based Architecture:** Thread/Room logic used for private conversations.
- [x] **Auto-Scroll:** Chat automatically scrolls down when a new message arrives.
- [x] **Sanitized UI:** Distinct color bubbles for 'You' (Blue) and 'Friend' (Gray).

### 2. THREAD / ROOM LOGIC EXPLAINED (Why Room Logic?)
**Question:** Why did we use Room Logic?
**Answer:** Previously, we were sending messages to the user's Socket ID. However, if a user has multiple tabs open, or if we want to create a group chat, Socket ID fails. Therefore, we made the "Thread ID" the "Room Name".

**How It Works (Step-by-Step):**
1. **JOIN:** When User A and User B want to chat, we check the backend to see if a Thread exists between them in the database (`findOrCreateThreadService`).
2. **SOCKET JOIN:** With the found Thread ID (e.g., "thread_123"), we join User A's socket to it: `socket.join("thread_123")`.
3. **EMIT:** When a message is sent, the server doesn't look for User B's specific location. It simply broadcasts to that "Room": `io.to("thread_123").emit(...)`.
   This ensures everyone in that room (A and B) receives the message.

### 3. FILE CHANGES SUMMARY
- `socket.js`: Added 'join-chat' event and used `io.to(threadId)` for sending messages.
- `chat.html`: Created `joinChat()` function and implemented waiting for 'room-joined' event.
- `chat.service.js`: Populated `name` and `email` fields so names are displayed.

# Chat App 

![Chat App Pro Preview](Screenshot%202026-02-13%20112533.png)