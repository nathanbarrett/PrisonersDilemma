<script setup lang="ts">
import PlayerCodeEditor from "@js/components/PlayerCodeEditor.vue";
import { canPlayInTournament, parsePlayerFromCode, SelectablePlayer } from "@js/common/tournament-helpers";
import { computed, ref, watch, onMounted } from "vue";
import axios from "@js/common/axios";
import { userPlayer } from "@js/players/templatePlayer";
import { usePage } from "@inertiajs/vue3";
import { User } from "@js/contracts/models/user";
import { TournamentRules } from "@js/contracts/tournaments";
import { CodeError } from "@js/components/CodeEditor.vue";
import { info, error, success } from "@js/common/snackbar";
import { AxiosResponse } from "axios";
import { AppPageProps } from "@js/contracts/inertia";
import { Player as PlayerModel } from "@js/contracts/models/player";

const props = defineProps<{
  tournamentRules: TournamentRules;
}>();
const selectablePlayers = defineModel<SelectablePlayer[]>({
  type: Array,
  default: () => [],
});
const unsavedPlayerId = ref<number>(-1);
const templatePlayer = ref<SelectablePlayer>({
  ...userPlayer,
  id: unsavedPlayerId.value,
  selected: false,
  isSystemPlayer: false,
  isVerified: false,
  isPublic: false,
  errored: false,
});

const user = computed<User|null>(() => usePage<AppPageProps>().props.auth.user as User|null);

const loadedPlayer = ref<SelectablePlayer | null>(null);
watch(selectablePlayers, (newVal, oldVal) => {
  if (newVal.length > 0 && (oldVal?.length || 0) === 0) {
    loadedPlayer.value = newVal[0];
    selectablePlayers.value = newVal.map((player) => {
      return {
          ...player,
          selected: canPlayInTournament(player, props.tournamentRules) ? player.selected : false,
      };
    });
  }
}, { deep: true, immediate: true });

async function createNewPlayer() {
    const newPlayer = { ...templatePlayer.value, id: unsavedPlayerId.value };
    selectablePlayers.value.unshift(newPlayer);
    loadedPlayer.value = newPlayer;
    unsavedPlayerId.value = unsavedPlayerId.value - 1;
    info("New player created. You can now edit the code.");
}

function loadNewPlayer(player: SelectablePlayer) {
    if (player.id === loadedPlayer.value?.id) return;
    loadedPlayer.value = player;
}

function onCodeErrors(errors: CodeError[]) {
    if (errors.length > 0 && loadedPlayer.value) {
        loadedPlayer.value.errored = true;
        loadedPlayer.value.selected = false;
    } else if (errors.length === 0 && loadedPlayer.value) {
        loadedPlayer.value.errored = false;
    }
    codeErrors.value = errors;
}

const codeErrors = ref<CodeError[]>([]);

function playerTextColor(player: SelectablePlayer) {
    if (player.errored) {
        return "text-red";
    }
    if (!canPlayInTournament(player, props.tournamentRules)) {
        return "text-grey";
    }
    return player.isSystemPlayer ? "text-blue" : "text-black";
}

function onPlayerChecked(player: SelectablePlayer, event) {
    player.selected = !!event?.target?.checked;
}

const guestTryingToSave = ref(false);
const savingPlayer = ref(false);
async function savePlayer() {
    if (savingPlayer.value || loadedPlayer.value.isSystemPlayer) return;
    if (!user.value) {
        guestTryingToSave.value = true;
        return;
    }
    savingPlayer.value = true;
    guestTryingToSave.value = false;

    const payload = {
        name: loadedPlayer.value.name,
        description: loadedPlayer.value.description,
        ts_code: loadedPlayer.value.code,
        tournamentRuleRequirements: {
            allowDecline: !!loadedPlayer.value.tournamentRuleRequirements?.allowDecline,
            revealOpponent: !!loadedPlayer.value.tournamentRuleRequirements?.revealOpponent,
            revealPreviousMatches: !!loadedPlayer.value.tournamentRuleRequirements?.revealPreviousMatches,
        }
    };

    let response: AxiosResponse;
    try {
        if (loadedPlayer.value.id === -1) {
            // Create new player
            response = await axios.post("/player", payload);
        } else {
            // Update existing player
            response = await axios.put(`/player/${loadedPlayer.value.id}`, payload);
        }
    } catch (err) {
        error("Failed to save player.");
        savingPlayer.value = false;
        console.error(err);
        return;
    }

    let created = false;
    if (loadedPlayer.value.id === -1) {
        created = true;
        loadedPlayer.value.id = response.data.id;
    }

    savingPlayer.value = false;
    success(`Player ${created ? "created" : "updated"} successfully.`);
}

onMounted(async () => {
    let response: AxiosResponse<PlayerModel>;
    try {
        response = await axios.get("/player/template");
    } catch (e) {
        console.error(e);
        error("Failed to load template player. Please try again later.");
        return;
    }

    templatePlayer.value = {
        id: unsavedPlayerId.value,
        name: response.data.name,
        description: response.data.description,
        code: response.data.ts_code,
        tournamentRuleRequirements: response.data.tournament_rule_requirements,
        selected: false,
        errored: false,
        isPublic: false,
        isSystemPlayer: false,
        isVerified: false,
        playRound: parsePlayerFromCode(response.data.ts_code).playRound,
    };
});
</script>

<template>
  <v-row no-gutters>
    <v-col cols="3">
      <v-btn
        flat
        block
        @click="createNewPlayer"
      >
        Create New Player
      </v-btn>
      <v-list select-strategy="classic">
        <v-list-item
          v-for="player in selectablePlayers"
          :key="player.name"
        >
          <template #prepend>
            <v-list-item-action start>
              <v-checkbox-btn
                :model-value="player.selected"
                :disabled="player.errored || !canPlayInTournament(player, props.tournamentRules)"
                @change="onPlayerChecked(player, $event)"
              />
            </v-list-item-action>
          </template>
          <v-list-item-title :class="playerTextColor(player)">
            {{ player.name }}
          </v-list-item-title>
          <template #append>
            <v-btn
              color="grey-lighten-1"
              icon="mdi-eye"
              variant="text"
              @click="loadNewPlayer(player)"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col
      cols="9"
      :style="{minHeight: '650px'}"
    >
      <v-btn
        flat
        block
        :disabled="!loadedPlayer || loadedPlayer.errored || loadedPlayer.isSystemPlayer"
        @click="savePlayer"
      >
        Save Player
      </v-btn>
      <PlayerCodeEditor
        v-if="loadedPlayer"
        v-model="loadedPlayer"
        @code:errors="onCodeErrors"
      />
      <v-alert
        v-if="codeErrors.length > 0"
        type="error"
        icon="mdi-alert"
        title="Code Errors"
        class="mt-5"
      >
        <ul>
          <li
            v-for="error in codeErrors"
            :key="error.message"
          >
            {{ error.message }} on line {{ error.lineNumber }}
          </li>
        </ul>
      </v-alert>
    </v-col>
  </v-row>
  <v-snackbar
    v-model="guestTryingToSave"
    color="error"
    top
  >
    You must be logged in to save a player.
  </v-snackbar>
</template>
