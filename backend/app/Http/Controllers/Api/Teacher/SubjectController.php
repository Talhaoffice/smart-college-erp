<?php

namespace App\Http\Controllers\Api\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $subjects = $request->user()
            ->teacher()
            ->with(['subjects.department'])
            ->firstOrFail()
            ->subjects
            ->map(function ($subject) {
                return [
                    ...$subject->toArray(),
                    'students_count' => $subject->department?->students()->count() ?? 0,
                ];
            });

        return response()->json([
            'data' => $subjects->values(),
        ]);
    }
}
