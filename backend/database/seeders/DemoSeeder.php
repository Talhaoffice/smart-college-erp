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
use RuntimeException;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->isProduction() && ! config('app.demo_seed_enabled')) {
            throw new RuntimeException('Demo seeding is disabled in production. Enable it explicitly for the seeding operation.');
        }

        $passwords = [
            'admin' => $this->password('app.demo_admin_password', 'DEMO_ADMIN_PASSWORD'),
            'teacher' => $this->password('app.demo_teacher_password', 'DEMO_TEACHER_PASSWORD'),
            'student' => $this->password('app.demo_student_password', 'DEMO_STUDENT_PASSWORD'),
        ];

        if (count(array_unique($passwords)) !== count($passwords)) {
            throw new RuntimeException('Each demo account must have a different password.');
        }

        DB::transaction(function () use ($passwords): void {
            $it = Department::firstOrCreate(['code' => 'IT'], [
                'name' => 'Information Technology',
                'description' => 'Cloud systems, software engineering, and data infrastructure.',
            ]);

            $cs = Department::firstOrCreate(['code' => 'CS'], [
                'name' => 'Computer Science',
                'description' => 'Algorithms, programming fundamentals, and distributed computing.',
            ]);

            $admin = User::updateOrCreate(['email' => 'admin.demo@smartcollegeerp.test'], [
                'name' => 'Demo College Administrator',
                'password' => Hash::make($passwords['admin']),
                'role' => UserRole::Admin,
            ]);

            $teacherUser = User::updateOrCreate(['email' => 'teacher.demo@smartcollegeerp.test'], [
                'name' => 'Demo Teacher Ayesha Rahman',
                'password' => Hash::make($passwords['teacher']),
                'role' => UserRole::Teacher,
            ]);

            $teacher = Teacher::updateOrCreate(['user_id' => $teacherUser->id], [
                'department_id' => $it->id,
                'employee_id' => 'DEMO-EMP-IT-001',
                'designation' => 'Associate Professor',
            ]);

            $studentUser = User::updateOrCreate(['email' => 'student.demo@smartcollegeerp.test'], [
                'name' => 'Demo Student Noah Thomas',
                'password' => Hash::make($passwords['student']),
                'role' => UserRole::Student,
            ]);

            $admin->tokens()->delete();
            $teacherUser->tokens()->delete();
            $studentUser->tokens()->delete();

            $student = Student::updateOrCreate(['user_id' => $studentUser->id], [
                'enrollment_no' => 'DEMO-IT-2026-001',
                'department_id' => $it->id,
                'semester' => 4,
                'phone' => '0000000000',
            ]);

            Fee::firstOrCreate(['student_id' => $student->id], [
                'status' => FeeStatus::Paid,
                'amount' => 70000,
                'due_date' => now()->addDays(20)->toDateString(),
            ]);

            $subjects = collect([
                ['department' => $it, 'code' => 'DEMO-IT101', 'name' => 'Cloud Fundamentals'],
                ['department' => $it, 'code' => 'DEMO-IT203', 'name' => 'Web Development'],
                ['department' => $cs, 'code' => 'DEMO-CS102', 'name' => 'Data Structures'],
            ])->map(fn (array $data) => Subject::updateOrCreate(
                ['code' => $data['code']],
                [
                    'department_id' => $data['department']->id,
                    'teacher_id' => $teacher->id,
                    'name' => $data['name'],
                    'credits' => 3,
                ],
            ));

            Notice::firstOrCreate([
                'title' => 'Demo College Annual Sports Meet',
                'created_by_user_id' => $admin->id,
            ], [
                'content' => 'The annual sports meet will be held next month. Registrations are open.',
                'is_global' => true,
            ]);

            foreach ($subjects as $subject) {
                Assignment::firstOrCreate([
                    'teacher_id' => $teacher->id,
                    'subject_id' => $subject->id,
                    'title' => 'Demo assignment: '.$subject->name,
                ], [
                    'description' => 'Complete the tasks mentioned in the sample syllabus.',
                    'deadline' => now()->addDays(7),
                ]);
            }
        });
    }

    private function password(string $configKey, string $environmentKey): string
    {
        $password = (string) config($configKey, '');

        if (strlen($password) < 20) {
            throw new RuntimeException($environmentKey.' must be provided securely and contain at least 20 characters.');
        }

        return $password;
    }
}
