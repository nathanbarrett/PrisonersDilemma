import { matchesPreviousPlayer } from "@js/players/matchesPreviousPlayer";
import { holdsGrudgesPlayer } from "@js/players/holdsGrudgesPlayer";
import { titForTatPlayer } from "@js/players/titForTatPlayer";
import { quicklyGhostPlayer } from "@js/players/quicklyGhostPlayer";
import { titForTwoTatsPlayer } from "@js/players/titForTwoTatsPlayer";
import { Player } from "@js/contracts/tournaments";
import { randomPlayer } from "@js/players/randomPlayer";
import { everyOtherPlayer } from "@js/players/everyOtherPlayer";
import { alwaysCooperate } from "@js/players/alwaysCooperate";
import { alwaysDefect } from "@js/players/alwaysDefect";

export const SystemPlayers: {[name: string]: Player} = {
    holdsGrudgesPlayer,
    matchesPreviousPlayer,
    titForTatPlayer,
    quicklyGhostPlayer,
    titForTwoTatsPlayer,
    randomPlayer,
    everyOtherPlayer,
    alwaysCooperate,
    alwaysDefect,
};
