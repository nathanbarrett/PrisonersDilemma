<script setup lang="ts">
import CodeEditor, { CodeError } from "@js/components/CodeEditor.vue";
import { parsePlayerFromCode, SelectablePlayer } from "@js/common/tournament-helpers";
import { Player } from "@js/contracts/tournaments";
import { computed, PropType, ref, watch } from "vue";
import { userPlayer } from "@js/players/templatePlayer";
import debounce from "lodash/debounce";

const emit = defineEmits<{
    (e: 'code:error', errored: boolean): void
    (e: 'code:errors', errors: CodeError[]): void
}>();

const { height } = defineProps({
    height: {
        type: [String, Number] as PropType<string | number>,
        default: "650",
    },
});

const editorHeight = computed(() => `${height}px`);
const player = defineModel<SelectablePlayer>({
    type: Object,
    default: () => ({
        ...userPlayer,
        id: 0,
        selected: false,
        isSystemPlayer: false,
        isVerified: false,
        isPublic: false,
        code: "",
    } satisfies SelectablePlayer),
});

const updateSelectablePlayer = debounce((newCode: string) => {
    if (!player.value || player.value.isSystemPlayer) {
        return;
    }

    let editorPlayer: Player;
    try {
        editorPlayer = parsePlayerFromCode(newCode);
    } catch (e) {
        console.error(e);
        emit("code:error", true);
        return;
    }
    if (
        typeof editorPlayer !== "object" ||
        typeof editorPlayer.playRound !== "function" ||
        typeof editorPlayer.name !== "string" ||
        typeof editorPlayer.description !== "string" ||
        !editorPlayer.name ||
        !editorPlayer.description
    ) {
        emit("code:error", true);
        return;
    }

    player.value.name = editorPlayer.name;
    player.value.description = editorPlayer.description;
    player.value.code = newCode;
    player.value.playRound = editorPlayer.playRound;
    emit("code:error", hasCodeErrors.value);
}, 500);

const code = ref(player.value.code);
watch(player, (newPlayer, oldPlayer) => {
    if (newPlayer.id !== oldPlayer?.id) {
        // new player loaded
        code.value = newPlayer.code;
    }
}, { deep: true, immediate: true });

watch(code, (newCode) => {
    if (player.value.isSystemPlayer || !newCode) {
        return;
    }
    updateSelectablePlayer(newCode);
});

const hasCodeErrors = ref(false);

function onCodeErrors(errors: CodeError[]) {
    hasCodeErrors.value = errors.length > 0;
    emit("code:errors", errors);
}

</script>

<template>
  <v-row>
    <v-col
      :style="{minHeight: editorHeight}"
    >
      <CodeEditor
        v-model="code"
        :class="hasCodeErrors ? 'code-errors' : ''"
        :read-only="player.isSystemPlayer"
        @code:errors="onCodeErrors"
      />
    </v-col>
  </v-row>
</template>

<style scoped>
  .code-errors {
      border: 1px solid red;
  }
</style>
