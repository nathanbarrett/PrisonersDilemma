/**
 * WARNING: The contents of system players are displayed to the end user
 */

import { Player } from "@js/contracts/tournaments";

export const quicklyGhostPlayer: Player = {
    name: 'Quickly Ghosts',
    description: 'If the opponent ever defects or declines then Quickly Ghosts will decline to play for the rest of the match. Otherwise, it will cooperate. It will cooperate on the first round.',
    playRound: async ({ currentMatch }) => {
        if (
            currentMatch.rounds
                .some(round => {
                    const opponentVote = currentMatch.isPlayer1 ? round.player2Vote : round.player1Vote;
                    return opponentVote === 'DEFECT' || opponentVote === 'DECLINE';
                })
        ) {
            return 'DECLINE';
        }

        return 'COOPERATE';
    },
    tournamentRuleRequirements: {
        allowDecline: true,
        revealOpponent: false,
        revealPreviousMatches: false,
    }
};
