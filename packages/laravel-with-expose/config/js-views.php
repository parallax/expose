<?php

return [
    'globals' => [
        'Expose' => [
            'isAdmin' => substr(request()->path(), 0, 7) === 'nocache',
            'data' => (object) [],
            'containers' => (object) []
        ]
    ]
];
