# College Event Platform

A full-stack event management web app designed to support public, private, and RSO (Registered Student Organization) events for university communities. This project includes a role-based permission system (Students, Admins, Super Admins), with functionality for event creation, commenting, approval flows, and constraint enforcement through the database layer.

> 🛠️ This repository is a public version of my individual contributions to a collaborative project originally hosted privately. I led the backend and database development, implemented key frontend features, and produced the final report and demo.



## 🔧 Features

- Role-based login and access control (Student, Admin, Super Admin)
- Event creation and search for:
  - Public events (require approval)
  - Private events
  - RSO-hosted events (must meet member count criteria)
- Commenting and rating system for events
- Administrative dashboard for event approvals
- Full backend API with:
  - Secure endpoints
  - Request validation
  - Lookup routes for universities, RSOs, and users



## 🗃️ Tech Stack

- **Frontend:** React, TypeScript
- **Backend:** Node.js, Express.js (JavaScript)
- **Database:** MySQL (3NF schema, ER modeling, constraints, and triggers)
- **Tools:** Postman, MySQL Workbench, Git, GitHub, ER diagramming



## 📐 MySQL Schema Highlights

I designed the complete relational schema with:

- 3NF decomposition and formal ER diagrams
- Triggers to enforce:
  - Minimum RSO member count for event creation
  - Non-overlapping time slots for RSO events
- Foreign key constraints and cascading deletes
- Stored procedures (optional)

The ER Model and relational model code can be found in the "Final Report", linked below.



## 📦 Backend Architecture

I rebuilt the Express backend from scratch after refactoring a broken initial version. Highlights include:

- Modularized route handling with middleware and controllers
- Role-based logic for route access
- Endpoints for:
  - Creating, updating, and deleting events
  - Approving public events (admin/super admin only)
  - Searching/filtering events
  - Comment creation and retrieval
  - University and RSO lookup by ID



## 🌐 Frontend Contributions

Although not my primary role, I implemented key React + TypeScript components and flows to ensure on-time delivery, including:

- Event creation and approval forms
- Commenting interface
- Route integration with backend API



## 🎥 Demo & Report

- 📝 [Final Report](https://docs.google.com/document/d/1BHoFnWYCV6CdFsr2HLNBQ_cU1JYbW8JbvAkqsT4AO3k/edit?usp=sharing)
- 🎬 [Project Demo Video](https://drive.google.com/file/d/1qpgSiqR47lKek5zrIISIGX-3Nq6m-g6D/view?usp=sharing)



## 🧠 Lessons Learned

- Practiced full-stack integration across backend, frontend, and database layers
- Applied theoretical database principles in a real system
- Improved debugging, refactoring, and project rescue skills in a time-constrained environment

---

## 🤝 Credits

This was originally a 3-person team project. This repo reflects **my individual contributions**, shared here for portfolio purposes.

