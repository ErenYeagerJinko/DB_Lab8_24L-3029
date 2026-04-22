# Lab 08 - Rozgar Pakistan E-Resume Builder

## 👤 Student Info
- **Name:** Abdul Ahad 
- **Roll No:** 24L-3029
- **Course:** Database Systems Lab (CL-2005)  
- **Instructor:** Muhammad Nouman Hanif  

---

## 📖 Project Description
A full-stack web application for the **Rozgar Pakistan E-Resume Builder** portal.  
Users can login securely and manage their work experience (**CRUD operations**).

---

## 🛠 Tech Stack
- **Frontend:** ReactJS  
- **Backend:** Node.js / Express  
- **Database:** SQL Server (RozgarDB)  
- **Packages:** express, mssql, cors  

---

## 📂 Project Structure
Lab-8/
├── backend/
│   ├── server.js              # Node.js backend with API endpoints
│   └── package.json           # Backend dependencies
├── frontend/
│   └── src/
│       ├── App.js             # Main React component
│       ├── Login.js           # Login page component
│       └── ExperienceTable.js # Experience table component
└── sql/
├── Setup.sql              # Database setup script
├── Task1_sp_LoginUser.sql # Login stored procedure
└── Task2_sp_GetAndAdd.sql # CRUD stored procedures


---

## 🚀 How to Run
1. Run `Setup.sql` in **SSMS** to create the database.  
2. Run `Task1_sp_LoginUser.sql` and `Task2_sp_GetAndAdd.sql` to create stored procedures.  
3. Start backend:  
   ```bash
   cd backend
   node server.js
cd frontend
npm start
