<?php

namespace App\Services\Billing;

use App\Contracts\BillingGateway;
use App\Data\BillingChargeResult;
use App\Models\Subscription;
use Illuminate\Support\Str;

class FakeBillingGateway implements BillingGateway
{
    public function charge(Subscription $subscription, float $amount, array $context = []): BillingChargeResult
    {
        $paymentMethod = Str::of($subscription->payment_method ?? '')
            ->trim()
            ->lower()
            ->value();

        $reference = 'SIM-'.Str::upper(Str::random(12));

        if ($paymentMethod === '' || in_array($paymentMethod, ['declined', 'failed', 'invalid'], true)) {
            return new BillingChargeResult(
                successful: false,
                reference: $reference,
                message: 'Payment failed while charging the saved payment method.',
                meta: [
                    'gateway' => 'simulated',
                    'amount' => $amount,
                ],
            );
        }

        return new BillingChargeResult(
            successful: true,
            reference: $reference,
            message: 'Subscription renewed successfully through the simulated billing gateway.',
            meta: [
                'gateway' => 'simulated',
                'amount' => $amount,
            ],
        );
    }
}
