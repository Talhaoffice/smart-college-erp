<?php

namespace App\Http\Controllers\Api\Admin;

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
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Notice::query()
                ->with(['department', 'author'])
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

    public function destroy(Notice $notice): JsonResponse
    {
        $notice->delete();

        return response()->json([
            'message' => 'Notice deleted successfully.',
        ]);
    }

    private function recipientsFor(Notice $notice)
    {
        if ($notice->is_global) {
            return User::query()
                ->whereKeyNot($notice->created_by_user_id)
                ->get();
        }

        return User::query()
            ->whereKeyNot($notice->created_by_user_id)
            ->where(function ($query) use ($notice): void {
                $query->whereHas('student', fn ($studentQuery) => $studentQuery->where('department_id', $notice->target_department_id))
                    ->orWhereHas('teacher', fn ($teacherQuery) => $teacherQuery->where('department_id', $notice->target_department_id));
            })
            ->get();
    }
}
