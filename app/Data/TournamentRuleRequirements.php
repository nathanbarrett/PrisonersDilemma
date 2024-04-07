<?php declare(strict_types=1);

namespace App\Data;

use Spatie\LaravelData\Data;

class TournamentRuleRequirements extends Data
{
    public function __construct(
        public bool $allowDecline = false,
        public bool $revealOpponent = false,
        public bool $revealPreviousMatches = false,
    ) {}
}
