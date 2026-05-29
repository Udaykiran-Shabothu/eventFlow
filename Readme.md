# EventFlow - Event Proposal Management System

## Project Overview

EventFlow is a full-stack Event Proposal Management System developed for colleges, universities, and organizations to streamline the process of event proposal submission, review, approval, and analytics.

The system supports multiple user roles including:

* Organizer
* Coordinator
* Admin

The platform helps departments digitally manage event planning workflows instead of using manual paperwork or spreadsheets.

---

# Features

## Authentication System

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Role-Based Access Control

---

# User Roles & Functionalities

## 1. Organizer

Organizers are responsible for creating and managing event proposals.

### Organizer Features

* Register/Login
* Create event proposals
* View own proposals
* Edit proposals (only before review starts)
* Delete pending proposals
* Track proposal status
* View review comments
* View proposal history

### Organizer Dashboard Includes

* Proposal list
* Status tracking
* Proposal details
* Create proposal form

---

## 2. Coordinator

Coordinators review and manage assigned event proposals.

### Coordinator Features

* Review proposals
* Change proposal status
* Assign priority
* Add review comments
* Track proposal workflow

### Proposal Status Options

* Pending
* In Review
* Changes Required
* Approved
* Rejected

### Priority Levels

* Low
* Medium
* High

---

## 3. Admin

Admins manage the overall system and analytics.

### Admin Features

* View dashboard analytics
* Department-wise analytics
* Category-wise analytics
* Monthly proposal trends
* Manage departments
* Monitor proposal statistics

### Admin Dashboard Metrics

* Total proposals
* Approved proposals
* Rejected proposals
* Pending reviews
* Budget utilization

---

# Tech Stack

## Frontend

* React JS
* React Router DOM
* React Toastify
* CSS

## Backend

* Node.js
* Express.js
* SQLite

## Authentication

* JWT (JSON Web Token)

---

# Project Structure

## Backend Structure

backend/

├── controllers/

├── database/

├── middleware/

├── routes/

├── schema/

├── server.js

├── .env

└── package.json

---

## Frontend Structure

src/

├── components/

│ ├── Login/

│ ├── Register/

│ ├── Navbar/

│ ├── OrganizerDashboard/

│ ├── CoordinatorDashboard/

│ ├── AdminDashboard/

│ ├── CreateProposal/

│ ├── MyProposals/

│ ├── ProposalDetails/

│ └── NotFound/

├── context/

├── services/

├── App.js

└── index.js

---

# Database Tables

## Departments

Stores department details.

## Users

Stores user information and roles.

## Event Proposals

Stores all event proposal data.

## Review Comments

Stores coordinator/admin comments.

## Proposal History

Tracks all proposal activities.

---

# Installation Guide

## Clone Repository

```bash
git clone https://github.com/Udaykiran-Shabothu/eventFlow.git
```

---

# Backend Setup

## Navigate to backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

## Start Server

```bash
npm run dev
```

Server runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

## Navigate to frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Start React App

```bash
npm start
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# Environment Variables

Create a `.env` file inside backend folder.

```env
PORT=5000

JWT_SECRET=mysecretkey
```

---

# Default Login Credentials

## Admin

```text
Email: admin@gmail.com
Password: admin123
```

## Coordinator

```text
Email: coordinator@gmail.com
Password: coordinator123
```

---

# API Endpoints

# Authentication

## Register

```http
POST /api/auth/register
```

## Login

```http
POST /api/auth/login
```

---

# Event Proposals

## Create Proposal

```http
POST /api/events
```

## Get All Proposals

```http
GET /api/events
```

## Get Single Proposal

```http
GET /api/events/:id
```

## Update Proposal

```http
PUT /api/events/:id
```

## Delete Proposal

```http
DELETE /api/events/:id
```

---

# Comments

## Add Comment

```http
POST /api/events/:id/comments
```

## Get Comments

```http
GET /api/events/:id/comments
```

---

# History

## Get Proposal History

```http
GET /api/events/:id/history
```

---

# Admin APIs

## Dashboard Summary

```http
GET /api/admin/dashboard
```

## Department Analytics

```http
GET /api/admin/departments
```

## Category Analytics

```http
GET /api/admin/categories
```

## Monthly Trends

```http
GET /api/admin/monthly-trends
```

---

# Security Features

* JWT Authentication
* Protected APIs
* Role-based authorization
* Input validation
* Duplicate proposal prevention

---

# Future Enhancements

* Email notifications
* File upload support
* Real-time status updates
* Calendar integration
* Advanced analytics charts
* Mobile responsive UI
* Export reports as PDF

---

# Learning Outcomes

This project demonstrates:

* Full-stack development
* REST API development
* Authentication & Authorization
* Database design
* React state management
* Protected routing
* CRUD operations
* Role-based systems

---

# Author

## Uday Kiran Shabothu

GitHub:
https://github.com/Udaykiran-Shabothu

---

# License

This project is developed for educational and portfolio purposes.
