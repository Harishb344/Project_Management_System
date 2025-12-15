# Mini Project Management System

A multi-tenant project management system built as part of a Software Engineer technical assessment.

This application demonstrates clean architecture, GraphQL API design, React + TypeScript frontend patterns, and organization-based data isolation.

---

## 🧩 Tech Stack

### Backend
- Python 3.10+
- Django 4.x
- Graphene-Django (GraphQL)
- PostgreSQL
- Organization-based multi-tenancy

### Frontend
- React 18
- TypeScript
- Apollo Client
- TailwindCSS
- Vite

---

## ✨ Features

### Project Management
- Create and edit projects
- Project status tracking (Active / On Hold / Completed)
- Automatic completion rate calculation
- Project completion updates based on task status

### Task Management
- Create and edit tasks
- Task status updates (TODO / IN_PROGRESS / DONE)
- Completed tasks become read-only
- Assign tasks via email

### Task Comments
- Add comments to tasks
- View comment history per task
- Timestamped discussion thread

### Multi-Tenancy
- Organization-level data isolation
- All queries and mutations scoped to an organization
- Organization passed via request headers

---

## 🧠 Architecture Decisions

- **GraphQL** chosen for flexible querying and reduced over-fetching
- **Apollo Client** used for cache management and refetching strategies
- **Django ORM** ensures relational integrity
- **Component-driven UI** for reusability and scalability
- **Strict TypeScript types** for safety and clarity

---

## 🚀 Setup Instructions

### Backend Setup

```bash
cd Backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### Frontend Setup

Bash :
    type below commands
    Frontend Setup
    npm install
    npm run dev

### Organization Header
   All Api requests require an Organization header:
          X-ORG-SLUG: ORGANIZATION SLUG NAME

### Future improvements

Authentication & user roles
Drag-and-drop task board
GraphQL subscriptions (real-time updates)
Pagination & filtering
Unit and integration tests
Dockerized deployment
