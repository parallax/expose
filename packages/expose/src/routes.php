<?php

Route::any('/nocache/{any?}')
    ->where('any', '.*')
    ->middleware(Parallax\Expose\NoCacheMiddleware::class);

Route::get('/admin', function () {
    return 'admin';
});
