<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventDemoMutations
{
    public function handle(Request $request, Closure $next): Response
    {
        if (
            config('app.demo_read_only')
            && $request->is('api/*')
            && ! in_array($request->route()?->uri(), ['api/login', 'api/logout'], true)
            && ! in_array($request->method(), ['GET', 'HEAD', 'OPTIONS'], true)
        ) {
            return response()->json([
                'message' => 'This public demo is read-only.',
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
