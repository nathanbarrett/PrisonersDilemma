/**
 * WARNING: The contents of system players are displayed to the end user
 */

import { Player } from "@js/contracts/tournaments";

export const everyOtherPlayer: Player = {
    name: 'Every Other',
    description: 'Cooperates on the first round, then alternates between cooperating and defecting.',
    playRound: async ({ currentMatch }) => {
        if (currentMatch.rounds.length === 0 || currentMatch.rounds.length % 2 === 0) {
            return 'COOPERATE';
        }

        return 'DEFECT';
    }
};
