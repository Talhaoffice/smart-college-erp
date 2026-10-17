<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\User;
use Database\Seeders\DemoSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class ErpApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_each_role_can_log_in(): void
    {
        foreach (UserRole::cases() as $role) {
            $password = Str::random(40);
            $user = User::factory()->create([
                'email' => $role->value.'@feature-test.invalid',
                'password' => Hash::make($password),
                'role' => $role,
            ]);

            $this->postJson('/api/login', [
                'email' => $user->email,
                'password' => $password,
            ])->assertOk()
                ->assertJsonPath('user.role', $role->value)
                ->assertJsonStructure(['token', 'user' => ['id', 'email', 'role']]);
        }
    }

    public function test_invalid_password_is_rejected(): void
    {
        $password = Str::random(40);

        User::factory()->create([
            'email' => 'student@feature-test.invalid',
            'password' => Hash::make($password),
            'role' => UserRole::Student,
        ]);

        $this->postJson('/api/login', [
            'email' => 'student@feature-test.invalid',
            'password' => Str::random(40),
        ])->assertUnprocessable();
    }

    public function test_role_middleware_denies_other_roles(): void
    {
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $teacher = User::factory()->create(['role' => UserRole::Teacher]);
        $student = User::factory()->create(['role' => UserRole::Student]);

        $this->actingAs($admin, 'sanctum')->getJson('/api/teacher/dashboard')->assertForbidden();
        $this->actingAs($teacher, 'sanctum')->getJson('/api/admin/dashboard')->assertForbidden();
        $this->actingAs($student, 'sanctum')->getJson('/api/admin/dashboard')->assertForbidden();
        $this->actingAs($student, 'sanctum')->getJson('/api/teacher/dashboard')->assertForbidden();
    }

    public function test_public_demo_mode_allows_reads_and_blocks_api_writes(): void
    {
        config(['app.demo_read_only' => true]);
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $department = Department::create(['name' => 'Existing Department', 'code' => 'EXISTING']);

        $this->actingAs($admin, 'sanctum')->getJson('/api/admin/dashboard')->assertOk();
        $payload = [
            'name' => 'Attempted change',
            'code' => 'WRITE-TEST',
        ];

        $this->actingAs($admin, 'sanctum')->postJson('/api/admin/departments', $payload)->assertForbidden();
        $this->actingAs($admin, 'sanctum')->putJson('/api/admin/departments/'.$department->id, [
            'name' => 'Updated name', 'code' => 'UPDATED',
        ])->assertForbidden();
        $this->actingAs($admin, 'sanctum')->patchJson('/api/admin/departments/'.$department->id, [
            'name' => 'Updated name', 'code' => 'UPDATED',
        ])->assertForbidden();
        $this->actingAs($admin, 'sanctum')->deleteJson('/api/admin/departments/'.$department->id)->assertForbidden();
        $this->actingAs($admin, 'sanctum')->postJson('/api/admin/students/import')->assertForbidden();
        $this->actingAs($admin, 'sanctum')->postJson('/api/notifications/read-all')->assertForbidden();

        $this->assertDatabaseCount('departments', 1);
        $this->assertDatabaseHas('departments', ['id' => $department->id, 'name' => 'Existing Department']);
    }

    public function test_read_only_demo_still_allows_login_and_logout(): void
    {
        config(['app.demo_read_only' => true]);
        $password = Str::random(40);
        $user = User::factory()->create([
            'email' => 'demo-login@feature-test.invalid',
            'password' => Hash::make($password),
            'role' => UserRole::Student,
        ]);

        $login = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => $password,
        ])->assertOk();

        $this->withToken($login->json('token'))->postJson('/api/logout')->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_development_mode_allows_authorized_writes_and_keeps_role_restrictions(): void
    {
        config(['app.demo_read_only' => false]);
        $admin = User::factory()->create(['role' => UserRole::Admin]);
        $student = User::factory()->create(['role' => UserRole::Student]);
        $payload = ['name' => 'Development Department', 'code' => 'DEV', 'description' => 'Test data'];

        $this->actingAs($admin, 'sanctum')->postJson('/api/admin/departments', $payload)
            ->assertCreated();
        $department = Department::where('code', 'DEV')->firstOrFail();

        $this->actingAs($admin, 'sanctum')->patchJson('/api/admin/departments/'.$department->id, [
            ...$payload, 'name' => 'Updated Development Department',
        ])->assertOk();
        $this->actingAs($student, 'sanctum')->postJson('/api/admin/departments', [
            'name' => 'Unauthorized Department', 'code' => 'NOPE',
        ])->assertForbidden();
        $this->assertDatabaseHas('departments', ['code' => 'DEV', 'name' => 'Updated Development Department']);
        $this->assertDatabaseMissing('departments', ['code' => 'NOPE']);
    }

    public function test_default_database_seeder_creates_no_accounts(): void
    {
        $this->seed();

        $this->assertDatabaseCount('users', 0);
    }

    public function test_demo_seeder_requires_secure_distinct_passwords_and_creates_synthetic_accounts(): void
    {
        $passwords = collect(['DEMO_ADMIN_PASSWORD', 'DEMO_TEACHER_PASSWORD', 'DEMO_STUDENT_PASSWORD'])
            ->mapWithKeys(fn (string $key) => [$key => Str::random(40)])
            ->all();

        $this->configureDemoPasswords($passwords);
        $this->seed(DemoSeeder::class);

        foreach ([
            'admin.demo@smartcollegeerp.test' => 'DEMO_ADMIN_PASSWORD',
            'teacher.demo@smartcollegeerp.test' => 'DEMO_TEACHER_PASSWORD',
            'student.demo@smartcollegeerp.test' => 'DEMO_STUDENT_PASSWORD',
        ] as $email => $key) {
            $this->postJson('/api/login', [
                'email' => $email,
                'password' => $passwords[$key],
            ])->assertOk();
        }

        $this->assertDatabaseCount('users', 3);
        $this->assertDatabaseHas('users', [
            'email' => 'admin.demo@smartcollegeerp.test',
            'role' => 'admin',
        ]);
        $this->assertDatabaseHas('users', [
            'email' => 'teacher.demo@smartcollegeerp.test',
            'role' => 'teacher',
        ]);
        $this->assertDatabaseHas('users', [
            'email' => 'student.demo@smartcollegeerp.test',
            'role' => 'student',
        ]);
    }

    public function test_demo_seeder_is_repeatable_and_preserves_relationships(): void
    {
        $passwords = collect(['DEMO_ADMIN_PASSWORD', 'DEMO_TEACHER_PASSWORD', 'DEMO_STUDENT_PASSWORD'])
            ->mapWithKeys(fn (string $key) => [$key => Str::random(40)])
            ->all();

        $this->configureDemoPasswords($passwords);
        $this->seed(DemoSeeder::class);
        $before = $this->demoBusinessSnapshot();
        $this->travel(1)->day();
        $this->seed(DemoSeeder::class);
        $this->travelBack();
        $after = $this->demoBusinessSnapshot();

        $this->assertSame($before, $after);
        $this->assertDatabaseCount('users', 3);
        $this->assertDatabaseCount('departments', 2);
        $this->assertDatabaseCount('teachers', 1);
        $this->assertDatabaseCount('students', 1);
        $this->assertDatabaseCount('subjects', 3);
        $this->assertDatabaseCount('fees', 1);
        $this->assertDatabaseCount('assignments', 3);
        $this->assertDatabaseCount('notices', 1);
        $this->assertDatabaseHas('students', [
            'user_id' => User::where('email', 'student.demo@smartcollegeerp.test')->value('id'),
            'department_id' => Department::where('code', 'IT')->value('id'),
        ]);
        $this->assertDatabaseHas('teachers', [
            'user_id' => User::where('email', 'teacher.demo@smartcollegeerp.test')->value('id'),
            'department_id' => Department::where('code', 'IT')->value('id'),
        ]);
    }

    private function demoBusinessSnapshot(): array
    {
        $tables = ['departments', 'teachers', 'students', 'fees', 'subjects', 'assignments', 'notices'];

        return collect($tables)->mapWithKeys(function (string $table): array {
            return [$table => \Illuminate\Support\Facades\DB::table($table)
                ->orderBy('id')
                ->get()
                ->map(fn ($row) => collect((array) $row)->except(['created_at', 'updated_at'])->all())
                ->all()];
        })->all();
    }

    public function test_demo_seeder_rejects_missing_short_and_duplicate_passwords(): void
    {
        $valid = [
            'DEMO_ADMIN_PASSWORD' => Str::random(40),
            'DEMO_TEACHER_PASSWORD' => Str::random(40),
            'DEMO_STUDENT_PASSWORD' => Str::random(40),
        ];
        $cases = [];
        foreach (array_keys($valid) as $missingKey) {
            $cases[] = [
                array_replace($valid, [$missingKey => '']),
                $missingKey.' must be provided securely and contain at least 20 characters.',
            ];
        }
        array_push($cases,
            [array_replace($valid, ['DEMO_TEACHER_PASSWORD' => Str::random(19)]), 'DEMO_TEACHER_PASSWORD must be provided securely and contain at least 20 characters.'],
            [array_fill_keys(array_keys($valid), Str::random(40)), 'Each demo account must have a different password.'],
        );

        foreach ($cases as [$passwords, $expectedMessage]) {
            $this->configureDemoPasswords($passwords);

            try {
                $this->seed(DemoSeeder::class);
                $this->fail('The demo seeder accepted invalid passwords.');
            } catch (\RuntimeException $exception) {
                $this->assertSame($expectedMessage, $exception->getMessage());
            }
        }

        $this->assertDatabaseCount('users', 0);
    }

    private function configureDemoPasswords(array $passwords): void
    {
        config([
            'app.demo_admin_password' => $passwords['DEMO_ADMIN_PASSWORD'],
            'app.demo_teacher_password' => $passwords['DEMO_TEACHER_PASSWORD'],
            'app.demo_student_password' => $passwords['DEMO_STUDENT_PASSWORD'],
        ]);
    }
}
