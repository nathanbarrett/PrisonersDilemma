<?php

namespace App\Console\Commands;

use App\Data\TournamentRuleRequirements;
use App\Models\Player;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use League\Flysystem\FilesystemException;

class PublishSystemPlayersCode extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:system-players:publish';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publishes the system players code to text files that can be read and displayed online';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $disk = Storage::disk('base');

        $contractsContent = Str::of($disk->get('resources/js/contracts/tournaments.ts'))
            ->replaceMatches('/^\/\*[\s\S]*?\*\//', '')
            ->replaceMatches('/\nexport /', "\n")
            ->trim()
            ->toString();

        $playerFiles = $disk->allFiles('resources/js/players');

        foreach ($playerFiles as $playerFile) {
            if ($playerFile === 'resources/js/players/index.ts') {
                continue;
            }

            $contents = Str::of($disk->get($playerFile))
                ->replaceMatches('/^\/\*[\s\S]*?\*\//', '')
                ->replaceMatches('/(^|\n)import .*/', '')
                ->trim()
                ->append("\n\n" . $contractsContent)
                ->toString();

            $name = $this->getPlayerName($contents);
            $description = $this->getPlayerDescription($contents);
            $tournamentRuleRequirements = $this->getTournamentRuleRequirements($contents);

            Player::query()
                ->updateOrCreate(
                    [
                        'is_system' => true,
                        'name' => $name
                    ],
                    [
                        'user_id' => null,
                        'description' => $description,
                        'ts_code' => $contents,
                        'is_verified' => true,
                        'is_public' => true,
                        'is_template' => Str::endsWith($playerFile, 'templatePlayer.ts'),
                        'tournament_rule_requirements' => $tournamentRuleRequirements,
                    ]
                );

            $this->info("Published {$name}");
        }

        return self::SUCCESS;
    }

    private function getPlayerName(string $code): string
    {
        return Str::of($code)
            ->match('/name: [\'|"](.*)[\'|"],/')
            ->toString();
    }

    private function getPlayerDescription(string $code): string
    {
        return Str::of($code)
            ->match('/description: [\'|"](.*)[\'|"],/')
            ->toString();
    }

    private function getTournamentRuleRequirements(string $code): TournamentRuleRequirements
    {
        $requirements = $this->getTournamentRuleRequirementsCode($code);

        if (empty($requirements)) {
            return new TournamentRuleRequirements();
        }

        return new TournamentRuleRequirements(
            allowDecline: Str::of($requirements)
                ->match('/allowDecline: (.*),/')
                ->toBoolean(),
            revealOpponent: Str::of($requirements)
                ->match('/revealOpponent: (.*),/')
                ->toBoolean(),
            revealPreviousMatches: Str::of($requirements)
                ->match('/revealPreviousMatches: (.*)/')
                ->toBoolean(),
        );
    }

    private function getTournamentRuleRequirementsCode(string $code): string
    {
        return Str::of($code)
            ->match('/tournamentRuleRequirements:\s*{\s*(.+?)\s*}/s')
            ->toString();
    }
}
