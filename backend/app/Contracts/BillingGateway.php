<?php

namespace App\Contracts;

use App\Data\BillingChargeResult;
use App\Models\Subscription;

interface BillingGateway
{
    public function charge(Subscription $subscription, float $amount, array $context = []): BillingChargeResult;
}
