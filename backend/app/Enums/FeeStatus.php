<?php

namespace App\Enums;

enum FeeStatus: string
{
    case Paid = 'paid';
    case Partial = 'partial';
    case Unpaid = 'unpaid';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
