<?php

use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\DepartmentController;
use App\Http\Controllers\Api\Admin\NoticeController as AdminNoticeController;
use App\Http\Controllers\Api\Admin\StudentController as AdminStudentController;

use App\Http\Controllers\Api\Admin\SubjectController;
use App\Http\Controllers\Api\Admin\TeacherController as AdminTeacherController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\Student\DashboardController as StudentDashboardController;

use App\Http\Controllers\Api\Teacher\AssignmentController;
use App\Http\Controllers\Api\Teacher\AttendanceController;
use App\Http\Controllers\Api\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\Api\Teacher\MarkController;
use App\Http\Controllers\Api\Teacher\NoticeController as TeacherNoticeController;
use App\Http\Controllers\Api\Teacher\StudentController as TeacherStudentController;
use App\Http\Controllers\Api\Teacher\SubjectController as TeacherSubjectController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);


Route::middleware(['auth:sanctum'])->group(function (): void {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);


    Route::middleware('role:admin,teacher')->group(function (): void {
        Route::get('/students/search/{enrollmentNo}', [SearchController::class, 'show']);
    });

    Route::prefix('admin')->middleware('role:admin')->group(function (): void {
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);
        Route::apiResource('departments', DepartmentController::class)->except(['show']);
        Route::apiResource('teachers', AdminTeacherController::class);
        Route::post('/students/import', [AdminStudentController::class, 'import']);
        Route::get('/students/sample', [AdminStudentController::class, 'downloadSample']);
        Route::apiResource('students', AdminStudentController::class);
        Route::apiResource('subjects', SubjectController::class)->except(['show']);
        Route::apiResource('notices', AdminNoticeController::class)->except(['show']);
    });

    Route::prefix('teacher')->middleware('role:teacher')->group(function (): void {
        Route::get('/dashboard', [TeacherDashboardController::class, 'index']);
        Route::get('/subjects', [TeacherSubjectController::class, 'index']);
        Route::get('/students', [TeacherStudentController::class, 'index']);

        Route::get('/attendance', [AttendanceController::class, 'index']);
        Route::post('/attendance', [AttendanceController::class, 'store']);

        Route::get('/marks', [MarkController::class, 'index']);
        Route::post('/marks', [MarkController::class, 'store']);

        Route::apiResource('assignments', AssignmentController::class)->except(['show']);
        Route::apiResource('notices', TeacherNoticeController::class)
            ->except(['show'])
            ->names('teacher.notices');
    });

    Route::prefix('student')->middleware('role:student')->group(function (): void {
        Route::get('/dashboard', [StudentDashboardController::class, 'index']);
        Route::get('/profile', [StudentDashboardController::class, 'profile']);
        Route::get('/attendance', [StudentDashboardController::class, 'attendance']);
        Route::get('/marks', [StudentDashboardController::class, 'marks']);
        Route::get('/fees', [StudentDashboardController::class, 'fees']);
        Route::get('/assignments', [StudentDashboardController::class, 'assignments']);
        Route::get('/notices', [StudentDashboardController::class, 'notices']);
    });
});
