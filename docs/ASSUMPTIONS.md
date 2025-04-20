# Project Assumptions

## Business Rules
1. Single admin user system
2. Students can receive multiple vaccinations
3. Vaccination drives require 15 days advance notice
4. No overlapping vaccination drives on same date
5. Past drives cannot be edited or deleted

## Technical Assumptions
1. Modern browser support (Chrome, Firefox, Safari)
2. Stable internet connection
3. MongoDB as database
4. CSV format for bulk imports
5. JWT for authentication

## Data Constraints
1. Student IDs are unique
2. Class numbers range from 1 to 12
3. Vaccination dates must be future dates
4. Minimum 1 dose per vaccination drive
5. At least one applicable class per drive

## Security Assumptions
1. Internal school network usage
2. Single admin role
3. No student/parent access required
4. No sensitive medical data stored 