/**
 * WARNING: The contents of system players are displayed to the end user
 */

import { Player } from "@js/contracts/tournaments";

export const titForTwoTatsPlayer: Player = {
    name: 'Tit For Two Tats',
    description: 'If the opponent ever defects or declines two times in a row then defect on the next turn only. Otherwise cooperate.',
    playRound: async ({ currentMatch }) => {
        if (currentMatch.rounds.length <= 1) {
            return 'COOPERATE';
        }

        if (
            currentMatch.rounds.slice(-2).every(r => {
                const opponentVote = currentMatch.isPlayer1 ? r.player2Vote : r.player1Vote;
                return opponentVote === 'DEFECT' || opponentVote === 'DECLINE';
            })
        ) {
            return 'DEFECT';
        }
        return 'COOPERATE';
    }
};
