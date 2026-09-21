<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $teacher = $this->teacher($request);
        $allowedDepartmentIds = $teacher->subjects->pluck('department_id')->unique()->values()->all();

        $subject = null;

        if ($request->filled('subject_id')) {
            $subject = Subject::query()->findOrFail($request->integer('subject_id'));

            abort_unless(
                $subject->teacher_id === $teacher->id,
                Response::HTTP_FORBIDDEN,
                'You can only view students for your assigned subjects.',
            );
        }

        $query = Student::query()
            ->with(['user', 'department', 'fee'])
            ->whereIn('department_id', $allowedDepartmentIds)
            ->orderBy('enrollment_no');

        if ($subject) {
            $query->where('department_id', $subject->department_id);
        } elseif ($request->filled('department_id')) {
            $departmentId = $request->integer('department_id');

            abort_unless(
                in_array($departmentId, $allowedDepartmentIds, true),
                Response::HTTP_FORBIDDEN,
                'You can only filter students from your assigned departments.',
            );

            $query->where('department_id', $departmentId);
        }

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($builder) use ($search): void {
                $builder->where('enrollment_no', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($userQuery) => $userQuery->where('name', 'like', "%{$search}%"));
            });
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }

    private function teacher(Request $request): Teacher
    {
        return $request->user()
            ->teacher()
            ->with(['subjects.department'])
            ->firstOrFail();
    }
}
