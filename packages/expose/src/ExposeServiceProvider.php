<?php

namespace Parallax\Expose;

use Illuminate\Support\ServiceProvider;

class ExposeServiceProvider extends ServiceProvider
{
    /**
     * Perform post-registration booting of services.
     *
     * @return  void
     */
    public function boot()
    {
        $this->publishes([
            __DIR__ . '/../config/expose.php' => config_path('expose.php'),
        ]);
        $this->publishes([
            __DIR__ . '/../dist/expose.js' => public_path('vendor/expose/expose.js'),
        ]);

        $this->loadRoutesFrom(__DIR__ . '/routes.php');
        $this->loadViewsFrom(__DIR__ . '/views', 'expose');
    }

    /**
     * Register bindings in the container.
     *
     * @return  void
     */
    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../config/expose.php', 'expose'
        );
    }
}
