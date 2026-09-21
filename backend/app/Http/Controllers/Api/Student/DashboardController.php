<?php

namespace App\Http\Controllers\Api\Student;

use App\Enums\AttendanceStatus;
use App\Enums\MarksType;
use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\Mark;
use App\Models\Notice;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $student = $this->student($request);
        
        $attendance = $this->attendanceBreakdown($student);
        $assignments = $this->assignmentList($student)->take(5)->values();
        $notices = $this->noticeList($student)->take(5)->values();
        $marks = $this->markList($student)->take(5)->values();

        return response()->json([
            'profile' => $this->profilePayload($student),
            'stats' => [
                'subjects' => count($attendance),
                'overall_attendance_percentage' => count($attendance) > 0
                    ? round(collect($attendance)->avg('percentage'), 2)
                    : 0,
                'pending_assignments' => collect($assignments)
                    ->where('deadline_at', '>=', now()->toDateTimeString())
                    ->count(),
                'notifications' => $request->user()->unreadNotifications()->count(),
            ],
            'attendance_preview' => $attendance,
            'marks_preview' => $marks,
            'assignments_preview' => $assignments,
            'notices_preview' => $notices,
        ]);
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->profilePayload($this->student($request)),
        ]);
    }

    public function attendance(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->attendanceBreakdown($this->student($request)),
        ]);
    }

    public function marks(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->markList($this->student($request)),
        ]);
    }

    public function fees(Request $request): JsonResponse
    {
        $student = $this->student($request);

        return response()->json([
            'data' => $student->fee ? [
                'status' => $student->fee->status->value,
                'amount' => (float) $student->fee->amount,
                'due_date' => optional($student->fee->due_date)->toDateString(),
                'updated_at' => optional($student->fee->updated_at)->toDateTimeString(),
            ] : null,
        ]);
    }

    public function assignments(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->assignmentList($this->student($request)),
        ]);
    }

    public function notices(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->noticeList($this->student($request)),
        ]);
    }

    private function student(Request $request): Student
    {
        return $request->user()
            ->student()
            ->with(['user', 'department', 'fee'])
            ->firstOrFail();
    }

    private function profilePayload(Student $student): array
    {
        return [
            'name' => $student->user->name,
            'email' => $student->user->email,
            'enrollment_no' => $student->enrollment_no,
            'semester' => $student->semester,
            'phone' => $student->phone,
            'department' => $student->department?->only(['id', 'name', 'code']),
        ];
    }

    private function attendanceBreakdown(Student $student): array
    {
        $subjects = Subject::query()
            ->where('department_id', $student->department_id)
            ->orderBy('name')
            ->get();

        $records = Attendance::query()
            ->where('student_id', $student->id)
            ->whereIn('subject_id', $subjects->pluck('id'))
            ->get()
            ->groupBy('subject_id');

        return $subjects->map(function ($subject) use ($records) {
            $subjectRecords = $records->get($subject->id, collect());
            $total = $subjectRecords->count();
            $attended = $subjectRecords
                ->filter(fn ($record) => $record->status !== AttendanceStatus::Absent)
                ->count();

            return [
                'subject_id' => $subject->id,
                'subject_code' => $subject->code,
                'subject_name' => $subject->name,
                'total_classes' => $total,
                'attended_classes' => $attended,
                'percentage' => $total > 0 ? round(($attended / $total) * 100, 2) : 0,
            ];
        })->values()->all();
    }

    private function markList(Student $student)
    {
        $subjects = Subject::query()
            ->where('department_id', $student->department_id)
            ->orderBy('name')
            ->get();

        $marks = Mark::query()
            ->where('student_id', $student->id)
            ->whereIn('subject_id', $subjects->pluck('id'))
            ->get()
            ->groupBy('subject_id');

        return $subjects->map(function ($subject) use ($marks) {
            $subjectMarks = $marks->get($subject->id, collect())->keyBy(
                fn ($mark) => $mark->marks_type->value,
            );

            return [
                'subject_id' => $subject->id,
                'subject_code' => $subject->code,
                'subject_name' => $subject->name,
                'internal' => optional($subjectMarks->get(MarksType::Internal->value))->marks,
                'external' => optional($subjectMarks->get(MarksType::External->value))->marks,
            ];
        })->values();
    }

    private function assignmentList(Student $student)
    {
        return Assignment::query()
            ->with(['subject.department', 'teacher.user'])
            ->whereHas('subject', fn ($subjectQuery) => $subjectQuery->where('department_id', $student->department_id))
            ->latest('deadline')
            ->get()
            ->map(fn ($assignment) => [
                'id' => $assignment->id,
                'title' => $assignment->title,
                'description' => $assignment->description,
                'deadline_at' => optional($assignment->deadline)->toDateTimeString(),
                'subject' => [
                    'id' => $assignment->subject->id,
                    'code' => $assignment->subject->code,
                    'name' => $assignment->subject->name,
                ],
                'teacher' => $assignment->teacher?->user?->name,
            ]);
    }

    private function noticeList(Student $student)
    {
        return Notice::query()
            ->with(['department', 'author'])
            ->where(function ($query) use ($student): void {
                $query->where('is_global', true)
                    ->orWhere('target_department_id', $student->department_id);
            })
            ->latest()
            ->get()
            ->map(fn ($notice) => [
                'id' => $notice->id,
                'title' => $notice->title,
                'content' => $notice->content,
                'scope' => $notice->is_global ? 'All Students' : $notice->department?->name,
                'author' => $notice->author?->name,
                'created_at' => optional($notice->created_at)->toDateTimeString(),
            ]);
    }
}
