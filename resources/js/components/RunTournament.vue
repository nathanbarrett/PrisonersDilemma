<script setup lang="ts">
import { SelectablePlayer, Tournament, runTournament, TournamentMatch } from "@js/common/tournament-helpers";
import { ref } from "vue";
import { TournamentRules } from "@js/contracts/tournaments";
import { truncate } from "@js/common/helpers";
import OverallTournamentResultsPointsChart from "@js/components/tournament-results-charts/OverallTournamentResultsPointsChart.vue";
import OverallTournamentResultsVotesChart
    from "@js/components/tournament-results-charts/OverallTournamentResultsVotesChart.vue";
import OverallTournamentResultsWinLossChart
    from "@js/components/tournament-results-charts/OverallTournamentResultsWinLossChart.vue";
import MatchPointsOverTimeChart from "@js/components/match-results-charts/MatchPointsOverTimeChart.vue";
import MatchVotesChart from "@js/components/match-results-charts/MatchVotesChart.vue";

const props = defineProps<{
    players: SelectablePlayer[];
    rules: TournamentRules;
}>();

const running = ref<boolean>(false);
const emit = defineEmits<{
    (e: 'running', isRunning: boolean): void
}>();

const tournamentResults = ref<Tournament|null>(null);
async function startTournament(): Promise<void> {
    if (running.value) {
        return;
    }
    tournamentResults.value = null;
    emit("running", true);
    running.value = true;
    try {
        tournamentResults.value = await runTournament(props.players, props.rules);
    } catch (e) {
        console.error(e);
    } finally {
        emit("running", false);
        running.value = false;
    }
}

const selectedMatch = ref<TournamentMatch|null>(null);
const selectedMatchChart = ref<"points" | "votes">("points");

type SelectedOverallChart = "points" | "votes" | "winloss"
const selectedOverallChart = ref<SelectedOverallChart>("points");
</script>

<template>
  <v-row no-gutters>
    <v-col cols="12">
      <v-btn
        flat
        block
        color="primary"
        :loading="running"
        :disabled="running || props.players.length < 2"
        @click="startTournament"
      >
        Run Tournament{{ tournamentResults ? " Again" : "" }}
      </v-btn>
    </v-col>
    <v-col
      v-if="!running && !tournamentResults"
      cols="12"
      class="d-flex flex-column align-center"
    >
      <h2 class="mt-6">
        Tournament Players
      </h2>
      <div
        v-for="player in props.players"
        :key="player.id"
        class="my-6 text-h6"
      >
        {{ player.name }}
      </div>
    </v-col>
    <v-col
      v-if="running"
      cols="12"
      class="d-flex justify-center align-center"
    >
      <v-progress-circular
        size="64"
        indeterminate
        color="primary"
        class="mt-16"
      />
    </v-col>
    <v-col
      v-if="tournamentResults && !running"
      cols="12"
    >
      <v-row>
        <v-col cols="3">
          <v-card
            v-for="match in tournamentResults.matches"
            :key="match.player1.name + match.player2.name"
            ripple
            class="mt-3"
            @click="selectedMatch = match"
          >
            <v-card-text>
              <div class="d-flex justify-center text-h6">
                <v-icon
                  v-if="match.player1Score > match.player2Score"
                  icon="mdi-trophy"
                  color="yellow"
                  class="mr-2"
                />
                {{ truncate(match.player1.name, 15) }}: {{ match.player1Score }}
              </div>
              <div class="d-flex justify-center">
                vs
              </div>
              <div class="d-flex justify-center text-h6">
                <v-icon
                  v-if="match.player2Score > match.player1Score"
                  icon="mdi-trophy"
                  color="yellow"
                  class="mr-2"
                />
                {{ truncate(match.player2.name, 15) }}: {{ match.player2Score }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="9">
          <v-card
            v-if="selectedMatch"
            class="mt-3"
            :title="'Match Results: ' + truncate(selectedMatch.player1.name, 20) + ' vs ' + truncate(selectedMatch.player2.name, 20)"
          >
            <v-card-text>
              <v-btn-toggle
                v-model="selectedMatchChart"
                class="mb-6"
              >
                <v-btn value="points">
                  Points Over Time
                </v-btn>
                <v-btn value="votes">
                  Votes
                </v-btn>
              </v-btn-toggle>
              <MatchPointsOverTimeChart
                v-if="selectedMatchChart === 'points'"
                :match="selectedMatch"
              />
              <MatchVotesChart
                v-else-if="selectedMatchChart === 'votes'"
                :match="selectedMatch"
              />
            </v-card-text>
          </v-card>
          <v-card
            v-if="tournamentResults"
            title="Overall Tournament Results"
            class="mt-3"
          >
            <v-card-text>
              <v-btn-toggle
                v-model="selectedOverallChart"
                class="mb-6"
              >
                <v-btn value="points">
                  Points
                </v-btn>
                <v-btn value="votes">
                  Votes
                </v-btn>
                <v-btn value="winloss">
                  Win/Loss
                </v-btn>
              </v-btn-toggle>
              <div class="chart-container">
                <OverallTournamentResultsPointsChart
                  v-if="selectedOverallChart === 'points'"
                  :tournament-results="tournamentResults"
                />
                <OverallTournamentResultsVotesChart
                  v-else-if="selectedOverallChart === 'votes'"
                  :tournament-results="tournamentResults"
                />
                <OverallTournamentResultsWinLossChart
                  v-else-if="selectedOverallChart === 'winloss'"
                  :tournament-results="tournamentResults"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<style scoped>
.chart-container {
    min-height: 420px;
}
</style>
