<template>
  <v-row>
    <v-col
      class="mt-8"
      cols="12"
    >
      Set the minimum and maximum number of rounds each match will run in a tournament. <br>
      At the start of a tournament a random number is chosen between those two numbers and every match will run that many rounds. <br>
      The difference between the minimum and maximum rounds must be at least {{ minRoundDifference }}.
      <v-range-slider
        v-model="roundRanges"
        class="mt-8"
        color="primary"
        thumb-label="always"
        :min="ABSOLUTE_MIN_ROUNDS"
        :max="ABSOLUTE_MAX_ROUNDS"
        step="1"
        @update:model-value="validateRange"
      />
      <v-switch
        v-model="allowDecline"
        color="primary"
        label="Allow Decline"
        hint="If any player declines, both players will get zero points for the round."
        :persistent-hint="true"
        @update:model-value="updateTournamentRules"
      />
      <v-switch
        v-model="revealOpponent"
        color="primary"
        label="Reveal Opponent"
        hint="Include player info in PlayRound information (but not their play function)"
        :persistent-hint="true"
        @update:model-value="updateTournamentRules"
      />
      <v-switch
        v-model="revealPreviousMatches"
        color="primary"
        label="Reveal Previous Matches"
        hint="Include previous matches in PlayRound information"
        :persistent-hint="true"
        @update:model-value="updateTournamentRules"
      />
      <hr class="mt-8">
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col
          md="12"
          lg="4"
        >
          <v-text-field
            v-model="bothCooperatePoints"
            label="Both Cooperate Points"
            type="number"
            color="primary"
            @update:model-value="updateTournamentRules"
          />
        </v-col>
        <v-col
          md="12"
          lg="4"
        >
          <v-text-field
            v-model="bothDefectPoints"
            label="Both Defect Points"
            type="number"
            color="primary"
            @update:model-value="updateTournamentRules"
          />
        </v-col>
        <v-col
          md="12"
          lg="4"
        >
          <v-text-field
            v-model="cooperateDefectPoints"
            label="Cooperate / Defect Points"
            type="number"
            color="primary"
            @update:model-value="updateTournamentRules"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-table>
        <thead>
          <tr>
            <th>Player 1 Vote</th>
            <th>Player 2 Vote</th>
            <th>Player 1 Points</th>
            <th>Player 2 Points</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cooperate</td>
            <td>Cooperate</td>
            <td>{{ bothCooperatePoints }}</td>
            <td>{{ bothCooperatePoints }}</td>
          </tr>
          <tr>
            <td>Cooperate</td>
            <td>Defect</td>
            <td>0</td>
            <td>{{ cooperateDefectPoints }}</td>
          </tr>
          <tr>
            <td>Defect</td>
            <td>Cooperate</td>
            <td>{{ cooperateDefectPoints }}</td>
            <td>0</td>
          </tr>
          <tr>
            <td>Defect</td>
            <td>Defect</td>
            <td>{{ bothDefectPoints }}</td>
            <td>{{ bothDefectPoints }}</td>
          </tr>
          <tr v-if="allowDecline">
            <td>Decline</td>
            <td>Cooperate, Defect, or Decline</td>
            <td>0</td>
            <td>0</td>
          </tr>
          <tr v-if="allowDecline">
            <td>Cooperate, Defect, or Decline</td>
            <td>Decline</td>
            <td>0</td>
            <td>0</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { TournamentRules } from "@js/contracts/tournaments";
import { ABSOLUTE_MAX_ROUNDS, ABSOLUTE_MIN_ROUNDS, MIN_ROUND_DIFFERENCE } from "@js/common/tournament-helpers";

const tournamentRules = defineModel<TournamentRules>();

const roundRanges = ref<number[]>([tournamentRules.value.minRounds, tournamentRules.value.maxRounds]);
function validateRange(): void {
  const [min, max] = roundRanges.value;
  if (max - min < MIN_ROUND_DIFFERENCE) {
    if (max - ABSOLUTE_MIN_ROUNDS >= MIN_ROUND_DIFFERENCE) {
        const newMin = max - MIN_ROUND_DIFFERENCE;
        roundRanges.value = [newMin, max];
    } else {
        const newMax = min + MIN_ROUND_DIFFERENCE;
        roundRanges.value = [max, newMax];
    }
  }
  updateTournamentRules();
}
const minRoundDifference = ref<number>(MIN_ROUND_DIFFERENCE);
const allowDecline = ref<boolean>(tournamentRules.value.allowDecline);
const revealOpponent = ref<boolean>(tournamentRules.value.revealOpponent);
const revealPreviousMatches = ref<boolean>(tournamentRules.value.revealPreviousMatches);
const bothCooperatePoints = ref<string>(tournamentRules.value.bothCooperatePoints.toString());
const bothDefectPoints = ref<string>(tournamentRules.value.bothDefectPoints.toString());
const cooperateDefectPoints = ref<string>(tournamentRules.value.cooperateDefectPoints.toString());

function updateTournamentRules(): void {
  forceValidValuesForPoints();
  tournamentRules.value.minRounds = roundRanges.value[0];
  tournamentRules.value.maxRounds = roundRanges.value[1];
  tournamentRules.value.allowDecline = allowDecline.value;
  tournamentRules.value.revealOpponent = revealOpponent.value;
  tournamentRules.value.revealPreviousMatches = revealPreviousMatches.value;
  tournamentRules.value.bothCooperatePoints = parseInt(bothCooperatePoints.value);
  tournamentRules.value.bothDefectPoints = parseInt(bothDefectPoints.value);
  tournamentRules.value.cooperateDefectPoints = parseInt(cooperateDefectPoints.value);
}

function forceValidValuesForPoints() {
    [bothDefectPoints, bothCooperatePoints, cooperateDefectPoints].forEach((ref) => {
        let val = parseInt(ref.value);
        if (val < 0) {
            ref.value = "0";
            return;
        }
        if (val.toString() !== ref.value) {
            ref.value = val.toString();
        }
    });
}
</script>
