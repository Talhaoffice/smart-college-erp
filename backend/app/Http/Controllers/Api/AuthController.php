<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        try {
            $credentials = $request->validate([
                'email' => ['required', 'string', 'email', 'max:255'],
                'password' => ['required', 'string'],
            ]);

            $user = User::where('email', strtolower($credentials['email']))->first();

            if (! $user || ! Hash::check($credentials['password'], $user->password)) {
                return response()->json([
                    'message' => 'The provided credentials are incorrect.',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $user->tokens()->delete();

            return response()->json([
                'message' => 'Login successful.',
                'token' => $user->createToken('college-erp')->plainTextToken,
                'user' => $this->formatUser($user),
            ]);
        } catch (Throwable $exception) {
            Log::error('Login request failed.', ['error' => $exception->getMessage()]);
            return response()->json(['message' => 'Something went wrong.'], 500);
        }
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->formatUser($request->user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    private function formatUser(User $user): array
    {
        $user->loadMissing(['teacher.department', 'teacher.subjects.department', 'student.department', 'student.fee']);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->roleValue(),
            'teacher' => $user->teacher ? [
                'id' => $user->teacher->id,
                'employee_id' => $user->teacher->employee_id,
                'designation' => $user->teacher->designation,
                'department' => $user->teacher->department?->only(['id', 'name', 'code']),
                'subjects' => $user->teacher->subjects
                    ->map(fn ($subject) => [
                        'id' => $subject->id,
                        'code' => $subject->code,
                        'name' => $subject->name,
                        'department' => $subject->department?->only(['id', 'name', 'code']),
                    ])
                    ->values(),
            ] : null,
            'student' => $user->student ? [
                'id' => $user->student->id,
                'enrollment_no' => $user->student->enrollment_no,
                'semester' => $user->student->semester,
                'phone' => $user->student->phone,
                'department' => $user->student->department?->only(['id', 'name', 'code']),
                'fee' => $user->student->fee ? [
                    'status' => $user->student->fee->status->value,
                    'amount' => (float) $user->student->fee->amount,
                    'due_date' => $user->student->fee->due_date?->toDateString(),
                ] : null,
            ] : null,
        ];
    }
}
