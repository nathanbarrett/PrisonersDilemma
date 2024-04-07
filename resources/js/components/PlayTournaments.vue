<script setup lang="ts">
import { computed, ref, onBeforeMount } from "vue";
import axios from "@js/common/axios";
import TournamentConfig from "@js/components/TournamentConfig.vue";
import RunTournament from "@js/components/RunTournament.vue";
import PlayerConfig from "@js/components/PlayerConfig.vue";
import { TournamentRules } from "@js/contracts/tournaments";
import {
    BaseTournamentRules,
    canPlayInTournament, parsePlayerFromCode,
    SelectablePlayer
} from "@js/common/tournament-helpers";
import { AxiosResponse } from "axios";
import { Player as PlayerModel } from "@js/contracts/models/player";
import { error } from "@js/common/snackbar";

enum TabPage {
    Play = "play",
    CreatePlayers = "createPlayers",
    TournamentConfiguration = "tournamentConfiguration",
}
const tabPage = ref<TabPage>(TabPage.CreatePlayers);
const tournamentRules = ref<TournamentRules>(BaseTournamentRules);
const tournamentPlayers = ref<SelectablePlayer[]>([]);
const playablePlayers = computed(() => tournamentPlayers.value.filter((p) => p.selected && canPlayInTournament(p, tournamentRules.value)));
onBeforeMount(async () => {
    let response: AxiosResponse<PlayerModel[]>;
    try {
        response = await axios.get("/players");
    } catch (e) {
        console.error(e);
        error("Failed to load players. Please try again later.");
        return;
    }
    tournamentPlayers.value = response.data.map((player) => {
        return {
            id: player.id,
            name: player.name,
            description: player.description,
            code: player.ts_code,
            tournamentRuleRequirements: player.tournament_rule_requirements,
            selected: false,
            errored: false,
            isPublic: player.is_public,
            isSystemPlayer: player.is_system,
            isVerified: player.is_verified,
            playRound: parsePlayerFromCode(player.ts_code).playRound,
        };
    });
});
</script>

<template>
  <v-tabs
    v-model="tabPage"
    bg-color="accent"
  >
    <v-tab
      :value="TabPage.Play"
      :disabled="playablePlayers.length < 2"
    >
      Run Tournament
    </v-tab>
    <v-tab :value="TabPage.CreatePlayers">
      Select & Create Players
    </v-tab>
    <v-tab :value="TabPage.TournamentConfiguration">
      Tournament Configuration
    </v-tab>
  </v-tabs>
  <v-row v-if="tabPage === TabPage.Play">
    <v-col cols="12">
      <RunTournament
        :players="playablePlayers"
        :rules="tournamentRules"
      />
    </v-col>
  </v-row>
  <v-row v-if="tabPage === TabPage.CreatePlayers">
    <v-col>
      <PlayerConfig
        v-model="tournamentPlayers"
        :tournament-rules="tournamentRules"
      />
    </v-col>
  </v-row>
  <v-row v-if="tabPage === TabPage.TournamentConfiguration">
    <v-col>
      <TournamentConfig v-model="tournamentRules" />
    </v-col>
  </v-row>
</template>
