<?php declare(strict_types=1);

namespace App\Models;

use App\Data\TournamentRuleRequirements;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'is_system' => 'boolean',
        'is_public' => 'boolean',
        'is_verified' => 'boolean',
        'tournament_rule_requirements' => TournamentRuleRequirements::class,
    ];

    public function scopeTemplate(Builder $query): Builder
    {
        return $query->where('is_template', true)
            ->where('is_system', true);
    }
}
