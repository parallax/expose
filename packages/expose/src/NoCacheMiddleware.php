<?php

namespace Parallax\Expose;

use Closure;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

class NoCacheMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($this->shouldHandle($request)) {
            $path = preg_replace('/^nocache\//', '', $request->path() . '/');
            $path = preg_replace('/\/$/', '', $path);
            $query = $request->query();
            $queryString = count($query) > 0 ? '?' . http_build_query($query) : '';

            return (
                Route::dispatch(
                    Request::create(
                        $path . $queryString, $request->method(),
                        $request->post(),
                        $request->cookie(),
                        $request->file(),
                        array_merge($request->server(), ['REQUEST_URI' => '/' . $path])
                    )
                )
            );
        }

        return $next($request);
    }

    private function shouldHandle($request)
    {
        return $request->is('nocache') || $request->is('nocache/*');
    }
}
