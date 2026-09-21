<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function show(Request $request, string $enrollmentNo): JsonResponse
    {
        $student = Student::query()
            ->with(['user', 'department', 'fee'])
            ->where('enrollment_no', $enrollmentNo)
            ->firstOrFail();

        if ($request->user()->isTeacher()) {
            $departmentIds = $request->user()
                ->teacher
                ->subjects()
                ->pluck('department_id')
                ->unique()
                ->values()
                ->all();

            abort_unless(
                in_array($student->department_id, $departmentIds, true),
                403,
                'You can only search students from your assigned departments.',
            );
        }

        return response()->json([
            'data' => [
                'id' => $student->id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'enrollment_no' => $student->enrollment_no,
                'semester' => $student->semester,
                'phone' => $student->phone,
                'department' => $student->department?->only(['id', 'name', 'code']),
                'fee' => $student->fee ? [
                    'status' => $student->fee->status->value,
                    'amount' => (float) $student->fee->amount,
                    'due_date' => $student->fee->due_date?->toDateString(),
                ] : null,
            ],
        ]);
    }
}
