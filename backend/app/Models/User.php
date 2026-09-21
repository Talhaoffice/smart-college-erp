<?php

namespace App\Models;

use App\Enums\UserRole;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => 'string',
        ];
    }

    protected function role(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => static::normalizeRole($value),
            set: fn (UserRole|string|null $value) => static::normalizeRole($value),
        );
    }

    protected function email(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value === null ? null : strtolower(trim($value)),
        );
    }

    public function teacher(): HasOne
    {
        return $this->hasOne(Teacher::class);
    }

    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    public function notices(): HasMany
    {
        return $this->hasMany(Notice::class, 'created_by_user_id');
    }



    public function isAdmin(): bool
    {
        return $this->hasRole(UserRole::Admin);
    }

    public function isTeacher(): bool
    {
        return $this->hasRole(UserRole::Teacher);
    }

    public function isStudent(): bool
    {
        return $this->hasRole(UserRole::Student);
    }

    public function hasRole(UserRole|string ...$roles): bool
    {
        $currentRole = $this->roleValue();

        if ($currentRole === null) {
            return false;
        }

        return collect($roles)
            ->map(fn (UserRole|string $role) => static::normalizeRole($role))
            ->filter()
            ->contains($currentRole);
    }

    public function roleValue(): ?string
    {
        return static::normalizeRole($this->getAttributeFromArray('role'));
    }

    public function roleEnum(): ?UserRole
    {
        return UserRole::tryFrom($this->roleValue() ?? '');
    }

    public static function normalizeRole(UserRole|string|null $role): ?string
    {
        if ($role instanceof UserRole) {
            return $role->value;
        }

        if ($role === null) {
            return null;
        }

        $normalized = strtolower(trim((string) $role));
        $normalized = str_replace([' ', '-'], '_', $normalized);

        return in_array($normalized, UserRole::values(), true)
            ? $normalized
            : null;
    }
}
