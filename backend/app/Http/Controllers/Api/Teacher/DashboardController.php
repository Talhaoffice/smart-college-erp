<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Enums\AttendanceStatus;
use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\Notice;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $teacher = $request->user()->teacher()->with(['subjects.department', 'department'])->firstOrFail();
        $subscription = Schema::hasTable('subscriptions')
            ? $request->user()->organization?->subscription
            : null;
        $subjectIds = $teacher->subjects->pluck('id');
        $departmentIds = $teacher->subjects->pluck('department_id')->unique();

        $todayAttendance = Attendance::query()
            ->whereIn('subject_id', $subjectIds)
            ->whereDate('date', today())
            ->get();

        $presentCount = $todayAttendance
            ->filter(fn ($record) => $record->status !== AttendanceStatus::Absent)
            ->count();

        return response()->json([
            'stats' => [
                'assigned_subjects' => $subjectIds->count(),
                'students_in_scope' => Student::query()->whereIn('department_id', $departmentIds)->count(),
                'attendance_today_percentage' => $todayAttendance->count() > 0
                    ? round(($presentCount / $todayAttendance->count()) * 100, 2)
                    : 0,
                'upcoming_assignments' => $subscription?->allowsFeature('assignments')
                    ? Assignment::query()
                        ->where('teacher_id', $teacher->id)
                        ->where('deadline', '>=', now())
                        ->count()
                    : 0,
            ],
            'subjects' => $teacher->subjects,
            'recent_assignments' => $subscription?->allowsFeature('assignments')
                ? Assignment::query()
                    ->with(['subject.department', 'teacher.user'])
                    ->where('teacher_id', $teacher->id)
                    ->latest()
                    ->take(5)
                    ->get()
                : collect(),
            'recent_notices' => Notice::query()
                ->with(['department'])
                ->where('created_by_user_id', $request->user()->id)
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }
}
