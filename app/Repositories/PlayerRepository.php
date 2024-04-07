<?php declare(strict_types=1);

namespace App\Repositories;

use App\Data\TournamentRuleRequirements;
use App\Models\Player;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Prettus\Repository\Eloquent\BaseRepository;

class PlayerRepository extends BaseRepository
{
    public function model(): string
    {
        return Player::class;
    }

    /**
     * @return Collection<int, Player>
     */
    public function userPlayers(): Collection
    {
        return Player::query()
            ->where('is_template', false)
            ->where(function (Builder $query) {
                $query->where('is_system', true)
                    ->when(auth()->id(), fn(Builder $query, $userId) => $query->orWhere('user_id', $userId));
            })
            ->orderBy('is_system', 'asc')
            ->get();
    }

    public function templatePlayer(): Player
    {
        return Player::query()
            ->template()
            ->first();
    }

    public function create(array $attributes): Player
    {
        $attributes['tournament_rule_requirements'] = new TournamentRuleRequirements(
            allowDecline: $attributes['tournament_rule_requirements']['allowDecline'] ?? false,
            revealOpponent: $attributes['tournament_rule_requirements']['revealOpponent'] ?? false,
            revealPreviousMatches: $attributes['tournament_rule_requirements']['revealPreviousMatches'] ?? false,
        );

        $attributes['user_id'] = auth()->id();

        return parent::create($attributes);
    }

    public function update(array $attributes, $id): Player
    {
        $attributes['tournament_rule_requirements'] = new TournamentRuleRequirements(
            allowDecline: $attributes['tournament_rule_requirements']['allowDecline'] ?? false,
            revealOpponent: $attributes['tournament_rule_requirements']['revealOpponent'] ?? false,
            revealPreviousMatches: $attributes['tournament_rule_requirements']['revealPreviousMatches'] ?? false,
        );

        return parent::update($attributes, $id);
    }
}
