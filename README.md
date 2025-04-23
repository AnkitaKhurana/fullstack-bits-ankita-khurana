# School Vaccination Portal

A full-stack web application for managing student vaccinations and vaccination drives in schools.

## Quick Links
- **Repository**: [GitHub Link](https://github.com/AnkitaKhurana/fullstack-bits-ankita-khurana)
- **Demo Video**: [Watch Here](https://drive.google.com/file/d/1lNkduxh8CuzjM6WlDJdMI0zvZz5Tq7y2/view?usp=sharing)

---

## Features

### Authentication
- Secure login/logout for school coordinators
- JWT-based session management
- Single admin role (no parent/student access)

### Student Management
- Add/Edit individual students
- Bulk import via CSV
- Search and filter functionality
- Unique student IDs
- Supports class range from 1 to 12

### Vaccination Drives
- Create, edit, and schedule drives
- Track dose availability
- Avoid overlapping drives
- Minimum 1 dose required per drive
- Past drives are immutable

### Reports & Analytics
- Real-time vaccination status tracking
- Generate and export vaccination reports (CSV)
- Dashboard with summary statistics and trends

---

## Tech Stack

### Frontend
- React.js with Material-UI
- Context API for global state management
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT-based authentication
- RESTful API design
- Express middleware for validation and auth

### Database Collections
- `students`
- `vaccination_drives`
- `users` (admin/coordinator)

---

## API Overview

### Authentication
- `POST /api/auth/login` - Login and receive JWT
- `POST /api/auth/register` - Register new admin

### Students
- `GET /api/students` - List students (pagination & filters)
- `POST /api/students` - Add student
- `POST /api/students/bulk` - Bulk upload
- `GET /api/students/report` - Download student vaccination report

### Vaccination Drives
- `GET /api/vaccination-drives` - List all drives
- `POST /api/vaccination-drives` - Create a drive
- `PUT /api/vaccination-drives/:id` - Update a drive
- `GET /api/vaccination-drives/stats` - Dashboard stats

---

## Project Assumptions

### Business Rules
1. One admin per school instance
2. Each student may receive multiple vaccinations
3. Drives must be scheduled 15 days in advance
4. No overlapping drives on the same date
5. Past vaccination drives cannot be modified

### Technical Constraints
- Modern browser compatibility (Chrome, Firefox, Safari)
- Internet connectivity is required
- CSV used for import/export
- Secure internal usage (school network)

### Security Practices
- JWT for user sessions
- Password hashing
- Input sanitization
- CORS and route protection

---

## Performance Considerations
- MongoDB indexing for query efficiency
- API pagination for large datasets
- Optimized Axios usage for frontend performance
- Error boundaries in React

---

## Local Setup

### 1. Clone the repository
git clone https://github.com/AnkitaKhurana/fullstack-bits-ankita-khurana.git

### 2. Install dependencies
Backend

cd backend
npm install
Frontend

cd ../frontend
npm install

### 3. Start the servers
Backend


Edit
cd backend
npm start
Frontend


Edit
cd ../frontend
npm start

### 4. Access the app
Frontend: http://localhost:3000
Backend API: http://localhost:5000
API Docs: http://localhost:5000/api-docs

### References
- React
- Material-UI
- MongoDB
- Express.js
- JWT

# Author
Ankita Khurana
