/**
 * WARNING: The contents of system players are displayed to the end user
 * This is used as the starting point for newly created players for a user
 */

import { Player } from "@js/contracts/tournaments";

export const randomPlayer: Player = {
    name: 'Random Player',
    description: 'Randomly Picks Defect or Cooperate.',
    playRound: async ({ currentMatch }) => {
        return Math.random() > 0.5 ? 'COOPERATE' : 'DEFECT';
    }
};
