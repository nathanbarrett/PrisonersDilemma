/**
 * WARNING: The contents of system players are displayed to the end user
 */

import { Player } from "@js/contracts/tournaments";

export const alwaysCooperate: Player = {
    name: 'Always Cooperate',
    description: 'Will always cooperate.',
    playRound: async () => {
        return "COOPERATE";
    }
};
