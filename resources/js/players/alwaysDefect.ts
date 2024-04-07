/**
 * WARNING: The contents of system players are displayed to the end user
 */

import { Player } from "@js/contracts/tournaments";

export const alwaysDefect: Player = {
    name: 'Always Defect',
    description: 'Will always defect.',
    playRound: async () => {
        return "DEFECT";
    }
};
