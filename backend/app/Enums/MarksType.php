<?php

namespace App\Enums;

enum MarksType: string
{
    case Internal = 'internal';
    case External = 'external';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
