<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Enums\AttendanceStatus;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class AttendanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject_id' => [
                'required',
                Rule::exists('subjects', 'id'),
            ],
            'date' => ['nullable', 'date'],
        ]);

        $subject = $this->subjectForTeacher($request, (int) $validated['subject_id']);
        $date = $validated['date'] ?? today()->toDateString();

        $attendance = Attendance::query()
            ->where('subject_id', $subject->id)
            ->whereDate('date', $date)
            ->get()
            ->keyBy('student_id');

        $students = Student::query()
            ->with('user')
            ->where('department_id', $subject->department_id)
            ->orderBy('enrollment_no')
            ->get()
            ->map(fn ($student) => [
                'student_id' => $student->id,
                'name' => $student->user->name,
                'enrollment_no' => $student->enrollment_no,
                'status' => $attendance[$student->id]->status->value ?? null,
            ]);

        return response()->json([
            'date' => $date,
            'subject' => $subject->load('department'),
            'data' => $students,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subject_id' => [
                'required',
                Rule::exists('subjects', 'id'),
            ],
            'date' => ['required', 'date'],
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.student_id' => ['required', 'exists:students,id'],
            'entries.*.status' => ['required', Rule::in(AttendanceStatus::values())],
        ]);

        $subject = $this->subjectForTeacher($request, (int) $validated['subject_id']);
        $studentIds = Student::query()
            ->where('department_id', $subject->department_id)
            ->pluck('id')
            ->all();

        foreach ($validated['entries'] as $entry) {
            abort_unless(
                in_array($entry['student_id'], $studentIds, true),
                Response::HTTP_UNPROCESSABLE_ENTITY,
                'One or more selected students do not belong to the subject department.',
            );
        }

        DB::transaction(function () use ($validated, $request): void {
            foreach ($validated['entries'] as $entry) {
                Attendance::updateOrCreate(
                    [
                        'student_id' => $entry['student_id'],
                        'subject_id' => $validated['subject_id'],
                        'date' => $validated['date'],
                    ],
                    [
                        'status' => $entry['status'],
                        'marked_by' => $request->user()->id,
                    ],
                );
            }
        });

        return response()->json([
            'message' => 'Attendance saved successfully.',
        ]);
    }

    private function subjectForTeacher(Request $request, int $subjectId): Subject
    {
        $teacher = $this->teacher($request);
        $subject = Subject::query()->with('department')->findOrFail($subjectId);

        abort_unless(
            $subject->teacher_id === $teacher->id,
            Response::HTTP_FORBIDDEN,
            'You can only manage attendance for your assigned subjects.',
        );

        return $subject;
    }

    private function teacher(Request $request): Teacher
    {
        return $request->user()->teacher()->firstOrFail();
    }
}
