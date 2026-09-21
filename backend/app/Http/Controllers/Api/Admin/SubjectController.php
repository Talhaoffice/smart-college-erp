<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class SubjectController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Subject::query()
                ->with(['department', 'teacher.user'])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'department_id' => [
                'required',
                Rule::exists('departments', 'id'),
            ],
            'teacher_id' => [
                'nullable',
                Rule::exists('teachers', 'id'),
            ],
            'code' => ['required', 'string', 'max:50', 'unique:subjects,code'],
            'name' => ['required', 'string', 'max:255'],
            'credits' => ['required', 'integer', 'between:1,6'],
        ]);

        $this->ensureTeacherMatchesDepartment($validated['teacher_id'] ?? null, $validated['department_id']);

        $subject = Subject::create($validated);

        return response()->json([
            'message' => 'Subject created successfully.',
            'data' => $subject->load(['department', 'teacher.user']),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, Subject $subject): JsonResponse
    {
        $validated = $request->validate([
            'department_id' => [
                'required',
                Rule::exists('departments', 'id'),
            ],
            'teacher_id' => [
                'nullable',
                Rule::exists('teachers', 'id'),
            ],
            'code' => ['required', 'string', 'max:50', Rule::unique('subjects', 'code')->ignore($subject->id)],
            'name' => ['required', 'string', 'max:255'],
            'credits' => ['required', 'integer', 'between:1,6'],
        ]);

        $this->ensureTeacherMatchesDepartment($validated['teacher_id'] ?? null, $validated['department_id']);

        $subject->update($validated);

        return response()->json([
            'message' => 'Subject updated successfully.',
            'data' => $subject->fresh()->load(['department', 'teacher.user']),
        ]);
    }

    public function destroy(Subject $subject): JsonResponse
    {
        abort_if(
            $subject->attendance()->exists() || $subject->marks()->exists() || $subject->assignments()->exists(),
            Response::HTTP_UNPROCESSABLE_ENTITY,
            'This subject already has academic records. Clear them before deleting the subject.',
        );

        $subject->delete();

        return response()->json([
            'message' => 'Subject deleted successfully.',
        ]);
    }

    private function ensureTeacherMatchesDepartment(?int $teacherId, int $departmentId): void
    {
        if (! $teacherId) {
            return;
        }

        $teacher = Teacher::findOrFail($teacherId);

        abort_unless(
            $teacher->department_id === $departmentId,
            Response::HTTP_UNPROCESSABLE_ENTITY,
            'Teachers can only be assigned to subjects within their department.',
        );
    }
}
