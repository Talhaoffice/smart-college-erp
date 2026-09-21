<?php

namespace App\Imports;

use App\Enums\FeeStatus;
use App\Enums\UserRole;
use App\Models\Department;
use App\Models\Fee;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;

class StudentsImport implements ToCollection, WithHeadingRow, WithValidation, SkipsOnFailure, SkipsOnError
{
    use SkipsFailures, SkipsErrors;

    public int $successCount = 0;

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        $departments = Department::pluck('id', 'name')->mapWithKeys(function ($id, $name) {
            return [strtolower(trim($name)) => $id];
        });

        foreach ($rows as $row) {
            DB::transaction(function () use ($row, $departments) {
                // Generate default password if empty
                $password = empty($row['password']) ? Str::random(8) : $row['password'];
                
                $user = User::create([
                    'name' => $row['name'],
                    'email' => $row['email'],
                    'password' => Hash::make($password),
                    'role' => UserRole::Student,
                ]);

                $deptName = strtolower(trim($row['department']));
                $departmentId = $departments[$deptName] ?? null;

                $student = Student::create([
                    'user_id' => $user->id,
                    'enrollment_no' => $row['enrollment_no'],
                    'department_id' => $departmentId,
                    'semester' => $row['semester'],
                    'phone' => $row['phone'] ?? null,
                ]);

                // Create a default fee record since it's required by the system design
                Fee::create([
                    'student_id' => $student->id,
                    'status' => FeeStatus::Unpaid,
                    'amount' => 0,
                    'due_date' => null,
                ]);

                $this->successCount++;
            });
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'enrollment_no' => ['required', 'string', 'max:100', 'unique:students,enrollment_no'],
            'department' => ['required', 'string', 'exists:departments,name'],
            'semester' => ['required', 'integer', 'between:1,8'],
            'phone' => ['nullable', 'string', 'max:30'],
            'password' => ['nullable', 'string', 'min:6'],
        ];
    }
}
