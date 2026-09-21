<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use App\Models\User;
use App\Notifications\NewNoticeNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class NoticeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => Notice::query()
                ->with(['department', 'author'])
                ->where('created_by_user_id', $request->user()->id)
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'target_department_id' => [
                'nullable',
                Rule::exists('departments', 'id'),
            ],
        ]);

        $allowedDepartmentIds = $request->user()
            ->teacher
            ->subjects()
            ->pluck('department_id')
            ->unique()
            ->values()
            ->all();

        if (! empty($validated['target_department_id'])) {
            abort_unless(
                in_array((int) $validated['target_department_id'], $allowedDepartmentIds, true),
                Response::HTTP_FORBIDDEN,
                'You can only publish notices for your assigned departments.',
            );
        }

        $notice = Notice::create([
            ...$validated,
            'created_by_user_id' => $request->user()->id,
            'is_global' => empty($validated['target_department_id']),
        ]);

        Notification::send(
            $this->recipientsFor($notice),
            new NewNoticeNotification($notice),
        );

        return response()->json([
            'message' => 'Notice published successfully.',
            'data' => $notice->load(['department', 'author']),
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, Notice $notice): JsonResponse
    {
        abort_unless(
            $notice->created_by_user_id === $request->user()->id,
            Response::HTTP_FORBIDDEN,
            'You can only update your own notices.',
        );

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'target_department_id' => [
                'nullable',
                Rule::exists('departments', 'id'),
            ],
        ]);

        $notice->update([
            ...$validated,
            'is_global' => empty($validated['target_department_id']),
        ]);

        return response()->json([
            'message' => 'Notice updated successfully.',
            'data' => $notice->fresh()->load(['department', 'author']),
        ]);
    }

    public function destroy(Request $request, Notice $notice): JsonResponse
    {
        abort_unless(
            $notice->created_by_user_id === $request->user()->id,
            Response::HTTP_FORBIDDEN,
            'You can only delete your own notices.',
        );

        $notice->delete();

        return response()->json([
            'message' => 'Notice deleted successfully.',
        ]);
    }

    private function recipientsFor(Notice $notice)
    {
        $students = User::query()->where('role', 'student');

        if (! $notice->is_global) {
            $students->whereHas(
                'student',
                fn ($studentQuery) => $studentQuery->where('department_id', $notice->target_department_id),
            );
        }

        return $students
            ->whereKeyNot($notice->created_by_user_id)
            ->get();
    }
}
