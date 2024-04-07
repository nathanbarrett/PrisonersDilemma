<script setup lang="ts">
import { TournamentMatch, TournamentPlayer } from "@js/common/tournament-helpers";
import Chart from "chart.js/auto";
import { watch, onMounted } from "vue";

const props = defineProps<{
    match: TournamentMatch;
}>();

function getMatchRoundLabels(): string[] {
    return props.match.rounds.map((r, i) => `Round ${i + 1}`);
}

watch(props, () => {
    buildChart();
}, { deep: true });

function getPlayerPointsOverTime(player: TournamentPlayer): number[] {
    let accumulatedPoints = 0;
    return props.match.rounds.map((round) => {
        const player1Score = round.player1Score;
        const player2Score = round.player2Score;
        const isPlayer1 = player.name === props.match.player1.name;
        const playerScore = isPlayer1 ? player1Score : player2Score;
        accumulatedPoints += playerScore;
        return accumulatedPoints;
    });
}

let chart: Chart|undefined;

function buildChart() {
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(
        "match-points-chart"
        , {
            type: "line",
            data: {
                labels: getMatchRoundLabels(),
                datasets: [
                    {
                        label: props.match.player1.name + " Points",
                        data: getPlayerPointsOverTime(props.match.player1),
                    },
                    {
                        label: props.match.player2.name + " Points",
                        data: getPlayerPointsOverTime(props.match.player2),
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
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
  <canvas id="match-points-chart" />
</template>
