# School Vaccination Portal - Design Document

## System Architecture

### Frontend Architecture
- React.js for UI components
- Material-UI for styling
- Context API for state management
- React Router for navigation
- Axios for API communication

### Backend Architecture
- Node.js + Express.js
- MongoDB for data storage
- JWT for authentication
- RESTful API design
- Middleware for auth and validation

## Database Design

### Collections
1. Students
2. VaccinationDrives
3. Users (Admin)

### Relationships
- Students -> VaccinationDrives (via vaccinations array)
- VaccinationDrives -> Students (via applicableClasses)

## API Design

### Authentication Flow
1. Admin login
2. JWT token generation
3. Token validation middleware

### Data Flow
1. Student Management
2. Vaccination Drive Management
3. Report Generation

## Security Considerations
- Password hashing
- JWT token validation
- Input sanitization
- CORS configuration
- Protected routes

## Performance Optimizations
- Pagination for large datasets
- Efficient MongoDB queries
- Frontend caching
- Error boundaries

## Assumptions
1. Single admin user system
2. Students can receive multiple vaccinations
3. Vaccination drives require 15 days advance notice
4. CSV format for bulk student import 