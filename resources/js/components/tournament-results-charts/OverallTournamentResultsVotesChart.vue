<script setup lang="ts">
import { Tournament, TournamentPlayer } from "@js/common/tournament-helpers";
import Chart from "chart.js/auto";
import { ChartDataset } from "chart.js/auto";
import { computed, onMounted } from "vue";
import { RoundVote } from "@js/contracts/tournaments";

const props = defineProps<{
  tournamentResults: Tournament;
}>();

const sortedPlayers = computed<TournamentPlayer[]>(() => {
    if (!props.tournamentResults.players) {
        return [];
    }
  return [...props.tournamentResults.players].sort((a, b) => b.totalPoints - a.totalPoints);
});

function getPlayerVoteCount(player: TournamentPlayer, voteType: RoundVote): number {
    return props.tournamentResults.matches
        .filter((match) => match.player1.name === player.name || match.player2.name === player.name)
        .reduce((acc, match) => {
            const isPlayer1 = match.player1.name === player.name;
            const matchVoteCount = match.rounds.reduce((acc, round) => {
                const playerVote = isPlayer1 ? round.player1Vote : round.player2Vote;
                if (playerVote === voteType) {
                    return acc + 1;
                }
                return acc;
            }, 0);
            return acc + matchVoteCount;
        }, 0);
}
function buildChart() {
    const datasets: ChartDataset[] = [
        {
            label: "Cooperate",
            data: sortedPlayers.value.map((p) => getPlayerVoteCount(p, "COOPERATE")),
            backgroundColor: "rgba(0, 255, 0, 0.5)",
        },
        {
            label: "Defect",
            data: sortedPlayers.value.map((p) => getPlayerVoteCount(p, "DEFECT")),
            backgroundColor: "rgba(255, 0, 0, 0.5)",
        },
    ];
    if (props.tournamentResults.rules?.allowDecline) {
        datasets.push({
            label: "Decline",
            data: sortedPlayers.value.map((p) => getPlayerVoteCount(p, "DECLINE")),
            backgroundColor: "rgba(0, 0, 255, 0.5)",
        });
    }
    new Chart(
        "overall-votes-chart"
        , {
        type: "bar",
        data: {
            labels: sortedPlayers.value.map((p) => p.name),
            datasets,
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                },
            },
        },
    });
}

onMounted(() => {
    setTimeout(() => {
        buildChart();
    }, 250);
});
</script>

<template>
  <canvas id="overall-votes-chart" />
</template>
