<script setup lang="ts">
import { Tournament, TournamentPlayer } from "@js/common/tournament-helpers";
import Chart from "chart.js/auto";
import { ChartDataset } from "chart.js/auto";
import { computed, onMounted } from "vue";

const props = defineProps<{
  tournamentResults: Tournament;
}>();

const sortedPlayers = computed<TournamentPlayer[]>(() => {
    if (!props.tournamentResults.players) {
        return [];
    }
  return [...props.tournamentResults.players].sort((a, b) => b.totalPoints - a.totalPoints);
});

function getPlayerWinOrLossCount(player: TournamentPlayer, winOrLoss: "WIN" | "LOSS"): number {
    return props.tournamentResults.matches
        .filter((match) => match.player1.name === player.name || match.player2.name === player.name)
        .reduce((acc, match) => {
            if (match.player1Score === match.player2Score) {
                return acc;
            }
            const isPlayer1 = match.player1.name === player.name;
            const wonMatch = isPlayer1 ? match.player1Score > match.player2Score : match.player2Score > match.player1Score;
            if ((winOrLoss === "WIN" && wonMatch) || (winOrLoss === "LOSS" && !wonMatch)) {
                return acc + 1;
            }
            return acc;
        }, 0);
}
function buildChart() {
    const datasets: ChartDataset[] = [
        {
            label: "Matches Won",
            data: sortedPlayers.value.map((p) => getPlayerWinOrLossCount(p, "WIN")),
            backgroundColor: "rgba(0, 255, 0, 0.5)",
        },
        {
            label: "Matches Lost",
            data: sortedPlayers.value.map((p) => getPlayerWinOrLossCount(p, "LOSS")),
            backgroundColor: "rgba(255, 0, 0, 0.5)",
        },
    ];
    new Chart(
        "overall-winloss-chart"
        , {
        type: "bar",
        data: {
            labels: sortedPlayers.value.map((p) => p.name),
            datasets,
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                    },
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
  <canvas id="overall-winloss-chart" />
</template>
