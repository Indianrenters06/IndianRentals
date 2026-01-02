# Project Dependencies Overview

This document lists the libraries and packages utilized in the Indian Renters application.

## Backend Dependencies
The backend is built using Node.js and uses the following packages to ensure performance, security, and scalability.

| Package | Version | Description |
| :--- | :--- | :--- |
| **express** | ^5.2.1 | The web framework used to handle API routes and HTTP requests. |
| **mongoose** | ^9.0.1 | Object Data Modeling (ODM) library for MongoDB and Node.js. |
| **dotenv** | ^17.2.3 | Loads environment variables from a `.env` file for configuration security. |
| **cors** | ^2.8.5 | Middleware to enable Cross-Origin Resource Sharing. |
| **bcrypt** | ^6.0.0 | Library for hashing passwords to ensure user security. |
| **jsonwebtoken** | ^9.0.3 | Implementation of JSON Web Tokens (JWT) for secure user authentication. |
| **cookie-parser** | ^1.4.7 | Middleware to parse cookies attached to the client request object. |
| **express-async-handler** | ^1.2.0 | Simple middleware to handle exceptions inside async express routes. |
| **multer** | ^2.0.2 | Middleware for handling `multipart/form-data`, used for file uploads. |
| **cloudinary** | ^2.8.0 | SDK to integrate with Cloudinary for image management and storage. |
| **streamifier** | ^0.1.1 | Helper to convert buffers (like uploaded files) into readable streams. |
| **nodemailer** | ^7.0.11 | Module to send emails (used for notifications, verification, etc). |
| **razorpay** | ^2.9.6 | SDK for integrating Razorpay payment gateway. |
| **axios** | ^1.13.2 | Promise-based HTTP client for making external API requests. |
| **winston** | ^3.19.0 | A versatile logging library for Node.js. |
| **morgan** | ^1.10.1 | HTTP request logger middleware for node.js. |

### Component Breakdown
- **Core Framework**: `express`, `dotenv`, `cors`, `cookie-parser`
- **Database**: `mongoose`
- **Authentication**: `bcrypt`, `jsonwebtoken`
- **File Handling**: `multer`, `cloudinary`, `streamifier`
- **Utilities**: `nodemailer`, `axios`, `express-async-handler`
- **Payments**: `razorpay`
- **Logging**: `winston`, `morgan`

## Frontend Dependencies
*The frontend development phase is upcoming. This section will be populated once the React/Next.js environment is initialized.*
