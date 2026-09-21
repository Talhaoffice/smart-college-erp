<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ErpApiTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_admin_can_log_in(): void
    {
        $this->postJson('/api/login', [
            'email' => 'admin@smartcollegeerp.test',
            'password' => 'password123',
        ])->assertOk()
            ->assertJsonPath('user.role', 'admin');
    }

    public function test_teacher_can_log_in(): void
    {
        $this->postJson('/api/login', [
            'email' => 'teacher.it@smartcollegeerp.test',
            'password' => 'password123',
        ])->assertOk()
            ->assertJsonPath('user.role', 'teacher');
    }

    public function test_student_can_log_in(): void
    {
        $this->postJson('/api/login', [
            'email' => 'student.it.1@smartcollegeerp.test',
            'password' => 'password123',
        ])->assertOk()
            ->assertJsonPath('user.role', 'student');
    }
}
