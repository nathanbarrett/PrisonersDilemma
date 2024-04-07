import { TournamentRules } from "@js/contracts/tournaments";

export interface Player {
    id: number;
    name: string;
    description: string;
    ts_code: string;
    is_system: boolean;
    is_public: boolean;
    is_verified: boolean;
    is_template: boolean;
    tournament_rule_requirements: Pick<TournamentRules, 'allowDecline' | 'revealOpponent' | 'revealPreviousMatches'>;
}
