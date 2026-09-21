# Smart College ERP System

A full-stack College ERP application designed to manage academic activities for Admin, Teachers, and Students.

The system provides role-based access and separate workflows for managing departments, teachers, students, subjects, attendance, marks, assignments, notices, and fees.

## Features

### Admin

- Manage departments
- Manage teachers
- Manage students
- Manage subjects
- Manage notices
- Manage academic data

### Teacher

- Manage student attendance
- Manage marks
- Manage assignments
- Manage notices
- View student directory

### Student

- View profile
- View attendance
- View marks
- View fees
- View assignments
- View notices

### Additional Features

- Role-based authentication
- Laravel Sanctum token authentication
- Enrollment-number-based student search
- Responsive dashboard interface
- Sidebar and top navigation
- Database notifications for assignments and notices
- REST API architecture

## Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS

### Backend

- Laravel 13
- PHP
- Laravel Sanctum
- REST API

### Database

- MySQL

## System Architecture

```text
React + Vite + Tailwind CSS
            │
            │ REST API
            ▼
     Laravel 13 Backend
            │
            │ Eloquent ORM
            ▼
          MySQL


Project Structure
smart-college-erp/
│
├── backend/       # Laravel REST API
│
├── frontend/      # React + Vite frontend
│
└── README.md
Demo Accounts

The project includes seeded demo accounts for testing.

All demo accounts use:

Password: password123
Admin
Email: admin@smartcollegeerp.test
Teacher
Email: teacher.it@smartcollegeerp.test
Student
Email: student.it.1@smartcollegeerp.test

These credentials are intended only for local/demo use.

Backend Setup
1. Navigate to the backend
cd backend
2. Install PHP dependencies
composer install
3. Create the environment file

Windows:

copy .env.example .env

Linux/macOS:

cp .env.example .env
4. Create the MySQL database

Create a database named:

smart_college_erp

Then update the database settings in .env:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_college_erp
DB_USERNAME=root
DB_PASSWORD=

Update the username and password according to your local MySQL configuration.

5. Generate the application key
php artisan key:generate
6. Run migrations and seed demo data
php artisan migrate:fresh --seed
7. Start the Laravel API
php artisan serve

The API will be available at:

http://127.0.0.1:8000
Frontend Setup

Open a second terminal.

1. Navigate to the frontend
cd frontend
2. Install dependencies
npm install
3. Create the environment file

Windows:

copy .env.example .env

Linux/macOS:

cp .env.example .env
4. Start the React development server
npm run dev

The frontend will be available at:

http://127.0.0.1:5173
Authentication

The application uses Laravel Sanctum for API authentication.

After successful login, the frontend authenticates API requests using a bearer token:

Authorization: Bearer <token>
Verification

The project has been tested with the following checks:

Backend
php artisan migrate:fresh --seed
php artisan test
Frontend
npm run build
Key Highlights
Full-stack React and Laravel application
Role-based access control
RESTful API communication
Token-based authentication
Relational MySQL database
Separate workflows for Admin, Teacher, and Student
Responsive dashboard UI
Academic management features including attendance and marks
Future Improvements
Online fee payment integration
Advanced reporting and analytics
PDF report generation
Email notification integration
Deployment with production infrastructure
Author

Talha Shaikh

Junior Web Developer
India

```
