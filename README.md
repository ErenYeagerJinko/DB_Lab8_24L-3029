Lab 08 - Rozgar Pakistan E-Resume Builder
Student Info
Name: M. Babar Shahzad
Roll No: 24L-3047
Course: Database Systems Lab (CL-2005)
Instructor: Muhammad Nouman Hanif
Project Description
A full-stack web application for the Rozgar Pakistan E-Resume Builder portal. Users can login securely and manage their work experience (CRUD operations).

Tech Stack
Frontend: ReactJS
Backend: Node.js / Express
Database: SQL Server (RozgarDB)
Packages: express, mssql, cors
Project Structure
Lab-8/ ├── backend/ │ ├── server.js # Node.js backend with API endpoints │ └── package.json # Backend dependencies ├── frontend/ │ └── src/ │ ├── App.js # Main React component │ ├── Login.js # Login page component │ └── ExperienceTable.js # Experience table component └── sql/ ├── Setup.sql # Database setup script ├── Task1_sp_LoginUser.sql # Login stored procedure └── Task2_sp_GetAndAdd.sql # CRUD stored procedures

How to Run
Run Setup.sql in SSMS to create the database
Run Task1 and Task2 SQL files to create stored procedures
Start backend: cd backend → node server.js
Start frontend: cd frontend → npm start
Open browser: http://localhost:3000
Tasks Completed
✅ Task 1: Secure Login Procedure (sp_LoginUser)
✅ Task 2: CRUD Procedures (sp_GetExperience, sp_AddExperience)
✅ Task 3: React Login Component
✅ Task 4: React Experience Table
✅ Task 5: Node.js Database Connection
✅ Task 6: Backend API for Adding Data
✅ Task 7: React useEffect (READ)
✅ Task 8: React Form Submission (CREATE)
