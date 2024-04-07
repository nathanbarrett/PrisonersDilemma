<?php

namespace Database\Factories;

use App\Data\TournamentRuleRequirements;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Player>
 */
class PlayerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name,
            'description' => $this->faker->sentence,
            'ts_code' => $this->faker->paragraphs(3, true),
            'is_system' => $this->faker->boolean,
            'is_public' => $this->faker->boolean,
            'is_verified' => $this->faker->boolean,
            'tournament_rule_requirements' => new TournamentRuleRequirements(),
        ];
    }
}
