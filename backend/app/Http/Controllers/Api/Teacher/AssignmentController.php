<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Student;
use App\Notifications\NewAssignmentNotification;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class AssignmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {


        $teacher = $request->user()->teacher()->firstOrFail();
        $query = Assignment::query()
            ->with(['subject.department', 'teacher.user'])
            ->where('teacher_id', $teacher->id)
            ->latest();

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->integer('subject_id'));
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        // FeatureAccess check removed for single-college system

        $teacher = $request->user()->teacher()->firstOrFail();

        $validated = $request->validate([
            'subject_id' => [
                'required',
                Rule::exists('subjects', 'id')
                    ->where('teacher_id', $teacher->id),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'deadline' => ['required', 'date', 'after:now'],
        ]);

        $assignment = Assignment::create([
            'teacher_id' => $teacher->id,
            ...$validated,
        ])->load(['subject.department', 'teacher.user']);

        $students = Student::query()
            ->where('department_id', $assignment->subject->department_id)
            ->with('user')
            ->get()
            ->pluck('user');

        Notification::send($students, new NewAssignmentNotification($assignment));

        return response()->json([
            'message' => 'Assignment created successfully.',
            'data' => $assignment,
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, Assignment $assignment): JsonResponse
    {


        $teacher = $request->user()->teacher()->firstOrFail();

        abort_unless(
            $assignment->teacher_id === $teacher->id,
            Response::HTTP_FORBIDDEN,
            'You can only update your own assignments.',
        );

        $validated = $request->validate([
            'subject_id' => [
                'required',
                Rule::exists('subjects', 'id')
                    ->where('teacher_id', $teacher->id),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'deadline' => ['required', 'date'],
        ]);

        $assignment->update($validated);

        return response()->json([
            'message' => 'Assignment updated successfully.',
            'data' => $assignment->fresh()->load(['subject.department', 'teacher.user']),
        ]);
    }

    public function destroy(Request $request, Assignment $assignment): JsonResponse
    {


        abort_unless(
            $assignment->teacher_id === $request->user()->teacher->id,
            Response::HTTP_FORBIDDEN,
            'You can only delete your own assignments.',
        );

        $assignment->delete();

        return response()->json([
            'message' => 'Assignment deleted successfully.',
        ]);
    }
}
