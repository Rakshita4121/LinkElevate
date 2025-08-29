# LinkElevate

LinkElevate is a professional networking platform built on the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to create meaningful connections, share posts, and engage socially in a secure environment.

# Features

Authentication & Authorization

Token-based authentication (simple token generation on login).

Tokens are stored in the browser’s localStorage.

Protected routes ensure only authenticated users can access certain pages.

User Management

User registration with profile creation.

Secure login with token validation.

Ability to update personal profile details.

Download other users’ profiles as PDF files for professional sharing.

Posts & Media Sharing

Create posts with text and images.

Image uploads handled via Multer.

Social interactions: likes, comments, and Twitter sharing.

Real-Time Notifications

Push notifications are sent to all users whenever a new post is created.

Connections & Networking

Send and accept connection requests.

Build a professional network directly within the platform.

# Tech Stack

Frontend: React.js (with protected routing & responsive UI)

Backend: Node.js + Express.js

Database: MongoDB (for users, posts, connections, comments, etc.)

Authentication: Token-based authentication (token stored in localStorage)

File Uploads: Multer (for image uploads)

Push Notifications: Web Push with Service Workers
