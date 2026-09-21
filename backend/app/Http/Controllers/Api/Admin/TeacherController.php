<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class TeacherController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Teacher::query()
                ->with(['user', 'department', 'subjects'])
                ->withCount('subjects')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email'),
            ],
            'password' => ['required', 'string', 'min:8'],
            'department_id' => [
                'required',
                Rule::exists('departments', 'id'),
            ],
            'employee_id' => [
                'required',
                'string',
                'max:100',
                Rule::unique('teachers', 'employee_id'),
            ],
            'designation' => ['nullable', 'string', 'max:255'],
        ]);

        $teacher = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => UserRole::Teacher,
            ]);

            return Teacher::create([
                'user_id' => $user->id,
                'department_id' => $validated['department_id'],
                'employee_id' => $validated['employee_id'],
                'designation' => $validated['designation'] ?? null,
            ]);
        });

        return response()->json([
            'message' => 'Teacher created successfully.',
            'data' => $teacher->load(['user', 'department']),
        ], Response::HTTP_CREATED);
    }

    public function show(Teacher $teacher): JsonResponse
    {
        return response()->json([
            'data' => $teacher->load(['user', 'department', 'subjects.department']),
        ]);
    }

    public function update(Request $request, Teacher $teacher): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')
                    ->ignore($teacher->user_id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'department_id' => [
                'required',
                Rule::exists('departments', 'id'),
            ],
            'employee_id' => [
                'required',
                'string',
                'max:100',
                Rule::unique('teachers', 'employee_id')
                    ->ignore($teacher->id),
            ],
            'designation' => ['nullable', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($validated, $teacher): void {
            $teacher->user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password']
                    ? Hash::make($validated['password'])
                    : $teacher->user->password,
            ]);

            $teacher->update([
                'department_id' => $validated['department_id'],
                'employee_id' => $validated['employee_id'],
                'designation' => $validated['designation'] ?? null,
            ]);
        });

        return response()->json([
            'message' => 'Teacher updated successfully.',
            'data' => $teacher->fresh()->load(['user', 'department', 'subjects.department']),
        ]);
    }

    public function destroy(Teacher $teacher): JsonResponse
    {
        DB::transaction(function () use ($teacher): void {
            $teacher->subjects()->update(['teacher_id' => null]);
            $teacher->user()->delete();
        });

        return response()->json([
            'message' => 'Teacher deleted successfully.',
        ]);
    }
}
