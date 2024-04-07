/**
 * WARNING: The contents of system players are displayed to the end user
 */

import { Player } from "@js/contracts/tournaments";

export const titForTatPlayer: Player = {
    name: 'Tit For Tat',
    description: 'If the opponent ever defects or declines then defect on the next turn only. Otherwise cooperate.',
    playRound: async ({ currentMatch }) => {
        if (currentMatch.rounds.length === 0) {
            return 'COOPERATE';
        }
        const lastRound = currentMatch.rounds[currentMatch.rounds.length - 1];
        const lastOpponentVote = currentMatch.isPlayer1 ? lastRound.player2Vote : lastRound.player1Vote;
        if (lastOpponentVote === 'DEFECT' || lastOpponentVote === 'DECLINE') {
            return 'DEFECT';
        }
        return 'COOPERATE';
    }
};
