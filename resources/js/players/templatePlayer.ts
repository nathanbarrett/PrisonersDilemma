/**
 * WARNING: The contents of system players are displayed to the end user
 * This is used as the starting point for newly created players for a user
 */

import { Player } from "@js/contracts/tournaments";

export const userPlayer: Player = {
    name: 'New Player (Replace Me)',
    description: 'Replace Me With A Good Description',
    /** IMPORTANT: Keep all of your code inside of this function */
    playRound: async (roundInfo) => {

        if (roundInfo.currentMatch.rounds.length === 0) {
            return 'COOPERATE';
        }

        return 'DEFECT';

    }
};
