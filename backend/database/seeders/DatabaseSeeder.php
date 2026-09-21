<?php

namespace Database\Seeders;

use App\Enums\FeeStatus;
use App\Enums\UserRole;
use App\Models\Assignment;
use App\Models\Department;
use App\Models\Fee;
use App\Models\Notice;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            // 1. Create Departments
            $it = Department::create([
                'name' => 'Information Technology',
                'code' => 'IT',
                'description' => 'Cloud systems, software engineering, and data infrastructure.',
            ]);

            $cs = Department::create([
                'name' => 'Computer Science',
                'code' => 'CS',
                'description' => 'Algorithms, programming fundamentals, and distributed computing.',
            ]);

            // 2. Create Users as requested
            
            // ADMIN
            $admin = User::create([
                'name' => 'College Administrator',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::Admin,
            ]);

            // TEACHER
            $teacherUser = User::create([
                'name' => 'Ayesha Rahman',
                'email' => 'teacher@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::Teacher,
            ]);

            $teacher = Teacher::create([
                'user_id' => $teacherUser->id,
                'department_id' => $it->id,
                'employee_id' => 'EMP-IT-001',
                'designation' => 'Associate Professor',
            ]);

            // STUDENT
            $studentUser = User::create([
                'name' => 'Noah Thomas',
                'email' => 'student@example.com',
                'password' => Hash::make('password'),
                'role' => UserRole::Student,
            ]);

            $student = Student::create([
                'user_id' => $studentUser->id,
                'enrollment_no' => 'IT2026001',
                'department_id' => $it->id,
                'semester' => 4,
                'phone' => '9001001001',
            ]);

            Fee::create([
                'student_id' => $student->id,
                'status' => FeeStatus::Paid,
                'amount' => 70000,
                'due_date' => now()->addDays(20)->toDateString(),
            ]);

            // 3. Create Subjects
            $subjects = collect([
                ['department' => $it, 'teacher' => $teacher, 'code' => 'IT101', 'name' => 'Cloud Fundamentals'],
                ['department' => $it, 'teacher' => $teacher, 'code' => 'IT203', 'name' => 'Web Development'],
                ['department' => $cs, 'teacher' => $teacher, 'code' => 'CS102', 'name' => 'Data Structures'],
            ])->map(fn(array $subjectData) => Subject::create([
                'department_id' => $subjectData['department']->id,
                'teacher_id' => $subjectData['teacher']->id,
                'code' => $subjectData['code'],
                'name' => $subjectData['name'],
                'credits' => 3,
            ]));

            // 4. Create Notices
            Notice::create([
                'title' => 'College Annual Sports Meet',
                'content' => 'The annual sports meet will be held next month. Registrations are open.',
                'created_by_user_id' => $admin->id,
                'is_global' => true,
            ]);

            // 5. Create Assignments
            foreach ($subjects as $subject) {
                Assignment::create([
                    'teacher_id' => $teacher->id,
                    'subject_id' => $subject->id,
                    'title' => 'Assignment for ' . $subject->name,
                    'description' => 'Complete the tasks mentioned in the syllabus.',
                    'deadline' => now()->addDays(7),
                ]);
            }
        });
    }
}
