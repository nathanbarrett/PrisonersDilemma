import {
    CurrentMatchInfo,
    Match,
    Player,
    PlayRoundInfo,
    Round,
    RoundVote,
    TournamentRules
} from "@js/contracts/tournaments";
import ts from "typescript";

export const ABSOLUTE_MIN_ROUNDS = 200;
export const ABSOLUTE_MAX_ROUNDS = 1000;
export const MIN_ROUND_DIFFERENCE = 100;

export const BaseTournamentRules: TournamentRules = {
    maxRounds: 300,
    minRounds: 200,
    allowDecline: false,
    revealOpponent: false,
    revealPreviousMatches: false,
    bothCooperatePoints: 3,
    bothDefectPoints: 1,
    cooperateDefectPoints: 5,
};

export interface SelectablePlayer extends Player {
    /** Unsaved user players get -1, otherwise a positive number */
    id: number;
    selected: boolean;
    errored?: boolean;
    isSystemPlayer: boolean;
    code?: string;
    isPublic: boolean;
    isVerified: boolean;
}

export function canPlayInTournament(player: SelectablePlayer, rules: TournamentRules): boolean {
    if (player.errored) {
        return false;
    }
    if (Object.keys(player.tournamentRuleRequirements || {}).length === 0) {
        return true;
    }
    if (
        player.tournamentRuleRequirements.allowDecline &&
        !rules.allowDecline
    ) {
        return false;
    }

    if (player.tournamentRuleRequirements.revealOpponent && !rules.revealOpponent) {
        return false;
    }

    if (player.tournamentRuleRequirements.revealPreviousMatches && !rules.revealPreviousMatches) {
        return false;
    }

    return true;
}

export interface TournamentPlayer extends Player {
    totalPoints: number;
}

export interface TournamentMatch extends Match {
    player1: TournamentPlayer;
    player2: TournamentPlayer;
    time: number;
}
export interface Tournament {
    rules: TournamentRules;
    players: TournamentPlayer[];
    matches: TournamentMatch[];
}

export async function runTournament(players: SelectablePlayer[], rules: TournamentRules): Promise<Tournament> {
    if (players.length < 2) {
        throw new Error("Need at least 2 players to run a tournament");
    }
    const tournament: Tournament = {
        rules,
        players: players.map(player => ({ ...player, totalPoints: 0 })),
        matches: [],
    };
    const matchCombinations: [TournamentPlayer, TournamentPlayer][] = getMatchCombinations(tournament.players);
    const tournamentMaxRounds = randomNumberBetween(rules.minRounds, rules.maxRounds);

    for (const matchCombination of matchCombinations) {
        const player1 = matchCombination[0];
        const player2 = matchCombination[1];
        const match: TournamentMatch = {
            player1,
            player2,
            rounds: [],
            maxRounds: tournamentMaxRounds,
            player1Score: 0,
            player2Score: 0,
            time: Date.now(),
        };
        for (let i = 0; i < match.maxRounds; i++) {
            const round = await runRound(player1, player2, match, rules);
            match.rounds.push(round);
            match.player1Score += round.player1Score;
            match.player2Score += round.player2Score;
        }
        match.player1.totalPoints += match.player1Score;
        match.player2.totalPoints += match.player2Score;
        match.time = Date.now() - match.time;
        tournament.matches.push(match);
    }

    return tournament;
}

function getMatchCombinations(players: TournamentPlayer[]): [TournamentPlayer, TournamentPlayer][] {
    const matchCombinations: [TournamentPlayer, TournamentPlayer][] = [];
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            matchCombinations.push([players[i], players[j]]);
        }
    }

    return matchCombinations;
}

async function runRound(player1: TournamentPlayer, player2: TournamentPlayer, match: Match, rules: TournamentRules): Promise<Round> {
    const currentMatchInfo: CurrentMatchInfo = {
        rounds: match.rounds,
        isPlayer1: true,
    };
    const playRoundInfo: PlayRoundInfo = {
        currentMatch: currentMatchInfo,
        rules,
    };
    if (rules.revealOpponent) {
        currentMatchInfo.opponent = getOpponentInfo(player2);
    }
    const player1Vote = await player1.playRound(playRoundInfo);
    playRoundInfo.currentMatch.isPlayer1 = false;
    if (rules.revealOpponent) {
        currentMatchInfo.opponent = getOpponentInfo(player1);
    }
    const player2Vote = await player2.playRound(playRoundInfo);
    if ((player1Vote === "DECLINE" || player2Vote === "DECLINE") && !rules.allowDecline) {
        throw new Error(`Player: "${player1Vote === 'DECLINE' ? player1.name : player2.name }" declined to play a round in a tournament that doesn't allow it`);
    }
    const player1Score = calculateScore(player1Vote, player2Vote, rules);
    const player2Score = calculateScore(player2Vote, player1Vote, rules);
    return {
        player1Vote,
        player2Vote,
        player1Score,
        player2Score,
    };
}

function getOpponentInfo(player: TournamentPlayer): Omit<Player, "playRound"> {
    return {
        name: player.name,
        description: player.description,
    };
}

function calculateScore(playerVote: RoundVote, opponentVote: RoundVote, rules: TournamentRules): number {
    if (playerVote === "COOPERATE" && opponentVote === "COOPERATE") {
        return rules.bothCooperatePoints;
    }
    if (playerVote === "DEFECT" && opponentVote === "DEFECT") {
        return rules.bothDefectPoints;
    }
    if (playerVote === "DEFECT" && opponentVote === "COOPERATE") {
        return rules.cooperateDefectPoints;
    }
    return 0;
}

function randomNumberBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function parsePlayerFromCode(newCode: string): Player {
    newCode = newCode.replace(/^export /, "");
    const transpiled = ts.transpile(newCode, {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ESNext,
        lib: ["dom"]
    });
    const firstCurly = transpiled.indexOf("{");
    const lastCurly = transpiled.lastIndexOf("}");
    const obj = transpiled.substring(firstCurly, lastCurly + 1).trim();

    return eval(`(${obj})`) as Player;
}
