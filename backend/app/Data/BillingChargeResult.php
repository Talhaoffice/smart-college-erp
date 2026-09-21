<?php

namespace App\Data;

class BillingChargeResult
{
    public function __construct(
        public readonly bool $successful,
        public readonly string $reference,
        public readonly string $message,
        public readonly array $meta = [],
    ) {
    }
}
