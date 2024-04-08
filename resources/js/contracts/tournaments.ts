/**
 * WARNING! This contents of this file are displayed to the end user to help them
 * build their own players. Do not include any sensitive information in this file.
 */

/**
 * HEY THERE! Coming here for the first time?
 * Go to "How To Play" in the menu at the top left to get started.
 *
 * All types and interfaces are below for your reference.
 * The code editor will also typehint these for you.
 * The goal is to return a Promise with either "COOPERATE" or "DEFECT" from the playRound function.
 * You are building a Player, so start by looking at the Player interface.
 */
export interface Player {
    /* Give the player a descriptive but short name */
    name: string;
    /* Describe how the player will play */
    description: string;

    /*
    This is the function that will be called when it's time to play a round
    It should return a promise that resolves to "COOPERATE", "DEFECT", or if tournament rules allow it, "DECLINE"
    All code outside of this function will be stripped away. So you can't use any external variables or functions.
    */
    playRound: PlayRound;

    /* Here you can optionally specify which tournament rules must be in place for this player to play */
    tournamentRuleRequirements?: Pick<TournamentRules, 'allowDecline' | 'revealOpponent' | 'revealPreviousMatches'>;
}

export type PlayRound = (playRoundInfo: PlayRoundInfo) => Promise<RoundVote>;

/* You can optionally return "DECLINE" from the playRound function ONLY if the tournament rules allow it */
export type RoundVote = 'COOPERATE' | 'DEFECT' | 'DECLINE';

/* This is the information that will be passed to the playRound function.*/
export interface PlayRoundInfo {
    currentMatch: CurrentMatchInfo;
    rules: TournamentRules;
    /** Will be present if the tournament rules allow it */
    previousMatches?: Match[];
}

export interface CurrentMatchInfo {
    rounds: Round[];
    /** Lets you know if you are player 1 or 2 in the match */
    isPlayer1: boolean;
    /* Will be present if the tournament rules allow it */
    opponent?: Omit<Player, 'playRound'>;
}

export interface Round {
    player1Vote: RoundVote;
    player2Vote: RoundVote;
    player1Score: number;
    player2Score: number;
}

export interface TournamentRules {
    maxRounds: number;
    minRounds: number;
    allowDecline: boolean;
    revealOpponent: boolean;
    revealPreviousMatches: boolean;
    bothCooperatePoints: number;
    bothDefectPoints: number;
    cooperateDefectPoints: number;
}

export interface Match {
    player1: Player;
    player2: Player;
    rounds: Round[];
    maxRounds: number;
    player1Score: number;
    player2Score: number;
}
