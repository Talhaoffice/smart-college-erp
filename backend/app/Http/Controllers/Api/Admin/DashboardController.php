<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\AttendanceStatus;
use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Notice;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $subscription = Schema::hasTable('subscriptions')
            ? request()->user()?->organization?->subscription
            : null;
        $canViewAssignments = $subscription?->allowsFeature('assignments') ?? false;
        $canViewAnalytics = $subscription?->allowsFeature('dashboard_analytics') ?? false;

        $attendanceTotal = Attendance::count();
        $attendancePositive = Attendance::query()
            ->whereIn('status', [
                AttendanceStatus::Present->value,
                AttendanceStatus::Late->value,
                AttendanceStatus::Excused->value,
            ])
            ->count();

        return response()->json([
            'stats' => [
                'total_students' => Student::count(),
                'total_teachers' => Teacher::count(),
                'total_departments' => Department::count(),
                'total_subjects' => Subject::count(),
                'attendance_percentage' => $attendanceTotal > 0
                    ? round(($attendancePositive / $attendanceTotal) * 100, 2)
                    : 0,
            ],
            'recent_notices' => Notice::query()
                ->with(['department', 'author'])
                ->latest()
                ->take(5)
                ->get(),
            'recent_assignments' => Assignment::query()
                ->with(['subject.department', 'teacher.user'])
                ->when($canViewAssignments, fn ($query) => $query, fn ($query) => $query->whereRaw('1 = 0'))
                ->latest()
                ->take(5)
                ->get(),
            'analytics' => $canViewAnalytics ? [
                'published_notices' => Notice::count(),
                'active_assignments' => Assignment::query()->whereDate('deadline', '>=', now()->toDateString())->count(),
                'tracked_attendance_records' => $attendanceTotal,
                'tracked_subjects' => Subject::count(),
            ] : null,
            'feature_access' => [
                'dashboard_analytics' => $canViewAnalytics,
            ],
        ]);
    }
}
