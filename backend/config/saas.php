<?php

return [
    'billing_cycle_days' => 30,
    'expiring_soon_days' => 7,

    'plans' => [
        'basic' => [
            'label' => 'Basic',
            'price' => 1999,
            'features' => [
                'attendance',
                'notices',
            ],
        ],
        'standard' => [
            'label' => 'Standard',
            'price' => 3999,
            'features' => [
                'attendance',
                'notices',
                'marks',
                'assignments',
            ],
        ],
        'premium' => [
            'label' => 'Premium',
            'price' => 6999,
            'features' => [
                'attendance',
                'notices',
                'marks',
                'assignments',
                'fees',
                'dashboard_analytics',
            ],
        ],
    ],

    'feature_labels' => [
        'attendance' => 'Attendance',
        'notices' => 'Notices',
        'marks' => 'Marks',
        'assignments' => 'Assignments',
        'fees' => 'Fees',
        'dashboard_analytics' => 'Dashboard analytics',
    ],
];
