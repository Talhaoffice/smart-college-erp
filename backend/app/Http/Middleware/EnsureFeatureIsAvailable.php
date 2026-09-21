<?php

namespace App\Http\Middleware;

use App\Support\Saas\FeatureAccess;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFeatureIsAvailable
{
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        FeatureAccess::ensure($request, $feature);

        return $next($request);
    }
}
