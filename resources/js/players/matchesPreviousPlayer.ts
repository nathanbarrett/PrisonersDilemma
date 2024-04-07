/**
 * WARNING: The contents of system players are displayed to the end user
 */

import { Player } from "@js/contracts/tournaments";

export const matchesPreviousPlayer: Player = {
    name: 'Matches Previous',
    description: 'Matches the previous move of the opponent. It will cooperate on the first round.',
    playRound: async ({ currentMatch }) => {
        if (currentMatch.rounds.length === 0) {
            return 'COOPERATE';
        }

        const lastRound = currentMatch.rounds[currentMatch.rounds.length - 1];

        return currentMatch.isPlayer1 ? lastRound.player2Vote : lastRound.player1Vote;
    }
};
