<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        config([
            'js-views.globals.Expose' => [
                'isAdmin' => substr(request()->path(), 0, 7) === 'nocache',
                'data' => (object) [
                    'title' => 'Test Title'
                ],
                'containers' => (object) []
            ]
        ]);
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
