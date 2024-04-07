<script lang="ts" setup>
import { TournamentMatch } from "@js/common/tournament-helpers";
import { RoundVote } from "@js/contracts/tournaments";

const props = defineProps<{
    match: TournamentMatch;
}>();

function getIconColorForVote(vote: RoundVote): string {
    if (vote === "COOPERATE") {
        return "green";
    }
    if (vote === "DEFECT") {
        return "red";
    }

    return "grey";
}

function getIconForVote(vote: RoundVote): string {
    if (vote === "COOPERATE") {
        return "mdi-thumb-up";
    }
    if (vote === "DEFECT") {
        return "mdi-thumb-down";
    }

    return "mdi-minus";
}

function getCumulativePointsForPlayer(roundIndex: number, player1: boolean): number {
    let cumulativePoints = 0;
    for (let i = 0; i <= roundIndex; i++) {
        const round = props.match.rounds[i];
        cumulativePoints += player1 ? round.player1Score : round.player2Score;
    }
    return cumulativePoints;
}

function displayVote(vote: RoundVote): string {
    if (vote === "COOPERATE") {
        return "Cooperate";
    }
    if (vote === "DEFECT") {
        return "Defect";
    }
    return "Decline";
}
</script>

<template>
  <div class="votes-container">
    <div class="text-h6">
      {{ props.match.player1.name }}: {{ props.match.player1.totalPoints }}
    </div>
    <div class="d-flex justify-start align-center overflow-x-auto">
      <div
        v-for="(round, index) in props.match.rounds"
        :key="index"
        style="min-width: 80px;"
        class="d-flex flex-column justify-start align-center mr-16"
      >
        Points: {{ round.player1Score }}
        Total: {{ getCumulativePointsForPlayer(index, true) }}

        <v-tooltip
          location="end"
          :text="displayVote(round.player1Vote)"
        >
          <template #activator="{ props: aprops }">
            <v-btn
              v-bind="aprops"
              :icon="getIconForVote(round.player1Vote)"
              class="mt-3"
              variant="outlined"
              size="x-small"
              :color="getIconColorForVote(round.player1Vote)"
            />
          </template>
        </v-tooltip>
        <div class="my-3">
          R{{ index + 1 }}
        </div>
        <v-tooltip
          location="end"
          :text="displayVote(round.player2Vote)"
        >
          <template #activator="{ props: aprops }">
            <v-btn
              v-bind="aprops"
              :icon="getIconForVote(round.player2Vote)"
              class="mb-3"
              variant="outlined"
              size="x-small"
              :color="getIconColorForVote(round.player2Vote)"
            />
          </template>
        </v-tooltip>
        Points: {{ round.player2Score }}
        Total: {{ getCumulativePointsForPlayer(index, false) }}
      </div>
    </div>
    <div class="text-h6">
      {{ props.match.player2.name }}: {{ props.match.player2.totalPoints }}
    </div>
  </div>
</template>
