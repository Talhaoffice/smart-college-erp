# Smart College ERP System (Cloud-Based)

A full-stack college ERP application with:

- `backend`: Laravel 13 REST API with Laravel Sanctum token authentication
- `frontend`: React + Vite + Tailwind CSS dashboard
- `database`: MySQL-first configuration with relational academic data models

## Features

- Role-based authentication for Admin, Teacher, and Student
- Admin management for departments, teachers, students, subjects, notices
- Teacher workflows for attendance, marks, assignments, notices, student directory
- Student portal for profile, attendance, marks, fees, assignments, notices
- Enrollment number based student search
- Responsive sidebar + top navbar dashboard UI
- Database notifications for assignments and notices

## Project Structure

```text
Collage-ERP-System/
├─ backend/    Laravel API
├─ frontend/   React application
└─ README.md
```

## Demo Accounts

All demo accounts use the password `password123`.

- Admin: `admin@smartcollegeerp.test`
- Teacher: `teacher.it@smartcollegeerp.test`
- Student: `student.it.1@smartcollegeerp.test`

## Backend Setup

1. Open a terminal in [`backend`](/C:/Users/huzai/OneDrive/Desktop/Collage-ERP-System/backend)
2. Install PHP dependencies:

```bash
composer install
```

3. Copy environment config:

```bash
copy .env.example .env
```

4. Create a MySQL database named `smart_college_erp`
5. Update `.env` with your MySQL username and password
6. Generate the application key:

```bash
php artisan key:generate
```

7. Run migrations and seed demo data:

```bash
php artisan migrate:fresh --seed
```

8. Start the API server:

```bash
php artisan serve
```

The API will be available at `http://127.0.0.1:8000/api`.

## Frontend Setup

1. Open a second terminal in [`frontend`](/C:/Users/huzai/OneDrive/Desktop/Collage-ERP-System/frontend)
2. Install Node dependencies:

```bash
npm install
```

3. Copy frontend environment config:

```bash
copy .env.example .env
```

4. Start the React app:

```bash
npm run dev
```

The frontend will run at `http://127.0.0.1:5173`.

## Verification

Backend checks completed:

- `php artisan migrate:fresh --seed`
- `php artisan test`

Frontend checks completed:

- `npm run build`

## Notes

- The backend workspace `.env` in this repo may still point to SQLite from local smoke testing. Use `.env.example` as the MySQL source of truth for your actual run.
- Sanctum is used with bearer tokens, so the React app authenticates through `Authorization: Bearer <token>`.
