<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\FeeStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Fee;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Student::query()
            ->with(['user', 'department', 'fee'])
            ->latest();

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->integer('department_id'));
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
            'enrollment_no' => [
                'required',
                'string',
                'max:100',
                Rule::unique('students', 'enrollment_no'),
            ],
            'department_id' => [
                'required',
                Rule::exists('departments', 'id'),
            ],
            'semester' => ['required', 'integer', 'between:1,8'],
            'phone' => ['nullable', 'string', 'max:30'],
            'fee_amount' => ['required', 'numeric', 'min:0'],
            'fee_status' => ['required', Rule::in(FeeStatus::values())],
            'fee_due_date' => ['nullable', 'date'],
        ]);

        $student = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => UserRole::Student,
            ]);

            $student = Student::create([
                'user_id' => $user->id,
                'enrollment_no' => $validated['enrollment_no'],
                'department_id' => $validated['department_id'],
                'semester' => $validated['semester'],
                'phone' => $validated['phone'] ?? null,
            ]);

            Fee::create([
                'student_id' => $student->id,
                'status' => $validated['fee_status'],
                'amount' => $validated['fee_amount'],
                'due_date' => $validated['fee_due_date'] ?? null,
            ]);

            return $student;
        });

        return response()->json([
            'message' => 'Student created successfully.',
            'data' => $student->load(['user', 'department', 'fee']),
        ], Response::HTTP_CREATED);
    }

    public function show(Student $student): JsonResponse
    {
        return response()->json([
            'data' => $student->load(['user', 'department', 'fee']),
        ]);
    }

    public function update(Request $request, Student $student): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($student->user_id),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'enrollment_no' => [
                'required',
                'string',
                'max:100',
                Rule::unique('students', 'enrollment_no')->ignore($student->id),
            ],
            'department_id' => [
                'required',
                Rule::exists('departments', 'id'),
            ],
            'semester' => ['required', 'integer', 'between:1,8'],
            'phone' => ['nullable', 'string', 'max:30'],
            'fee_amount' => ['required', 'numeric', 'min:0'],
            'fee_status' => ['required', Rule::in(FeeStatus::values())],
            'fee_due_date' => ['nullable', 'date'],
        ]);

        DB::transaction(function () use ($validated, $student): void {
            $student->user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password']
                    ? Hash::make($validated['password'])
                    : $student->user->password,
            ]);

            $student->update([
                'enrollment_no' => $validated['enrollment_no'],
                'department_id' => $validated['department_id'],
                'semester' => $validated['semester'],
                'phone' => $validated['phone'] ?? null,
            ]);

            $student->fee()->updateOrCreate(
                ['student_id' => $student->id],
                [
                    'status' => $validated['fee_status'],
                    'amount' => $validated['fee_amount'],
                    'due_date' => $validated['fee_due_date'] ?? null,
                ],
            );
        });

        return response()->json([
            'message' => 'Student updated successfully.',
            'data' => $student->fresh()->load(['user', 'department', 'fee']),
        ]);
    }

    public function destroy(Student $student): JsonResponse
    {
        $student->user()->delete();

        return response()->json([
            'message' => 'Student deleted successfully.',
        ]);
    }
    
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,csv,txt', 'max:10240'],
        ]);

        $import = new \App\Imports\StudentsImport();
        \Maatwebsite\Excel\Facades\Excel::import($import, $request->file('file'));

        $failures = [];
        foreach ($import->failures() as $failure) {
            $failures[] = [
                'row' => $failure->row(),
                'attribute' => $failure->attribute(),
                'errors' => $failure->errors(),
                'values' => $failure->values(),
            ];
        }

        return response()->json([
            'message' => 'Import process completed.',
            'success_count' => $import->successCount,
            'failed_count' => count($import->failures()),
            'failures' => $failures,
        ]);
    }

    public function downloadSample(): Response
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="students_sample.csv"',
        ];

        $columns = ['name', 'email', 'enrollment_no', 'department', 'semester', 'phone'];

        $callback = function () use ($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            
            // Example row
            fputcsv($file, [
                'John Doe',
                'john.doe@example.com',
                'ENR2023001',
                'Computer Science',
                '1',
                '1234567890'
            ]);
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
