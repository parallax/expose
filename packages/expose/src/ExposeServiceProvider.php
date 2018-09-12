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

        $this->loadRoutesFrom(__DIR__ . '/routes.php');
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
