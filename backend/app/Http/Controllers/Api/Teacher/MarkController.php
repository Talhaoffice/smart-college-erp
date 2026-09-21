<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Enums\MarksType;
use App\Http\Controllers\Controller;
use App\Models\Mark;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class MarkController extends Controller
{
    public function index(Request $request): JsonResponse
    {


        $validated = $request->validate([
            'subject_id' => [
                'required',
                Rule::exists('subjects', 'id'),
            ],
        ]);

        $subject = $this->subjectForTeacher($request, (int) $validated['subject_id']);
        $marks = Mark::query()
            ->where('subject_id', $subject->id)
            ->get()
            ->groupBy('student_id');

        $students = Student::query()
            ->with('user')
            ->where('department_id', $subject->department_id)
            ->orderBy('enrollment_no')
            ->get()
            ->map(function ($student) use ($marks) {
                $studentMarks = $marks->get($student->id, collect())->keyBy(
                    fn ($mark) => $mark->marks_type->value,
                );

                return [
                    'student_id' => $student->id,
                    'name' => $student->user->name,
                    'enrollment_no' => $student->enrollment_no,
                    'internal' => optional($studentMarks->get(MarksType::Internal->value))->marks,
                    'external' => optional($studentMarks->get(MarksType::External->value))->marks,
                ];
            });

        return response()->json([
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
            'marks_type' => ['required', Rule::in(MarksType::values())],
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.student_id' => ['required', 'exists:students,id'],
            'entries.*.marks' => ['required', 'numeric', 'min:0', 'max:100'],
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
                Mark::updateOrCreate(
                    [
                        'student_id' => $entry['student_id'],
                        'subject_id' => $validated['subject_id'],
                        'marks_type' => $validated['marks_type'],
                    ],
                    [
                        'marks' => $entry['marks'],
                        'recorded_by' => $request->user()->id,
                    ],
                );
            }
        });

        return response()->json([
            'message' => 'Marks saved successfully.',
        ]);
    }

    private function subjectForTeacher(Request $request, int $subjectId): Subject
    {
        $teacher = $this->teacher($request);
        $subject = Subject::query()->findOrFail($subjectId);

        abort_unless(
            $subject->teacher_id === $teacher->id,
            Response::HTTP_FORBIDDEN,
            'You can only manage marks for your assigned subjects.',
        );

        return $subject;
    }

    private function teacher(Request $request): Teacher
    {
        return $request->user()->teacher()->firstOrFail();
    }
}
