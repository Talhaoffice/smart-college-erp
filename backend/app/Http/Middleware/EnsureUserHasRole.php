<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        $normalizedRoles = collect($roles)
            ->map(fn (string $role) => \App\Models\User::normalizeRole($role))
            ->filter()
            ->values()
            ->all();

        abort_unless($user, Response::HTTP_UNAUTHORIZED, 'Authentication is required.');
        abort_unless(
            $user->roleValue() !== null,
            Response::HTTP_FORBIDDEN,
            'Your account role is invalid. Please contact support.',
        );
        abort_unless(
            in_array($user->roleValue(), $normalizedRoles, true),
            Response::HTTP_FORBIDDEN,
            'You do not have permission to access this resource.',
        );

        return $next($request);
    }
}
