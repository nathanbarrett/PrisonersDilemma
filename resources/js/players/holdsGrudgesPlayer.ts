/**
 * WARNING: The contents of system players are displayed to the end user
 */

import { Player } from "@js/contracts/tournaments";

export const holdsGrudgesPlayer: Player = {
    name: 'Holds Grudges',
    description: 'If the opponent ever defects or declines then Holds Grudges will defect for the rest of the match',
    playRound: async ({ currentMatch }) => {
        if (
            currentMatch.rounds
                .some(round => {
                    const opponentVote = currentMatch.isPlayer1 ? round.player2Vote : round.player1Vote;
                    return opponentVote === 'DEFECT' || opponentVote === 'DECLINE';
                })
        ) {
            return 'DEFECT';
        }
        return 'COOPERATE';
    }
};
