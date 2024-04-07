<script setup lang="ts">
import { Tournament, TournamentPlayer } from "@js/common/tournament-helpers";
import Chart from "chart.js/auto";
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
function buildChart() {
    new Chart(
        "overall-results-chart"
        , {
        type: "bar",
        data: {
            labels: sortedPlayers.value.map((p) => p.name),
            datasets: [
                {
                    label: "Points",
                    data: sortedPlayers.value.map((p) => p.totalPoints),
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
  <canvas id="overall-results-chart" />
</template>
