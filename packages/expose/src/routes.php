<?php

Route::any('/nocache/{any?}')
    ->where('any', '.*')
    ->middleware(Parallax\Expose\NoCacheMiddleware::class);

Route::view('/admin', 'expose::admin');
