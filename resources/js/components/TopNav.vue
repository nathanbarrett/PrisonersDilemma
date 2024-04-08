<script setup lang="ts">
import { computed, ref, onBeforeMount } from "vue";
import { useTheme, useDisplay } from "vuetify";
import { User } from "@js/contracts/models/user";
import { usePage, router } from "@inertiajs/vue3";

const theme = useTheme();
const { mobile } = useDisplay();
const openAboutDialog = ref<boolean>(false);
const user = computed<User|null>(() => usePage().props.auth.user);
const appName = computed<string>(() => usePage().props.appName as string);
const isDarkTheme = computed<boolean>(() => theme.global.name.value === "LivvDarkTheme");

function toggleTheme(): void {
    const currentTheme = theme.global.name.value;
    theme.global.name.value = currentTheme === "LivvDarkTheme" ? "LivvLightTheme" : "LivvDarkTheme";
    localStorage.setItem("theme", theme.global.name.value);
}

onBeforeMount(() => {
    const storedTheme = localStorage.getItem("theme");
    if (![ "LivvDarkTheme", "LivvLightTheme" ].includes(storedTheme)) {
        return;
    }
    if (storedTheme && storedTheme !== theme.global.name.value) {
        theme.global.name.value = storedTheme;
    }
});
</script>

<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon
      id="appBarIcon"
      icon="mdi-menu"
    />
    <v-menu
      activator="#appBarIcon"
      :close-on-content-click="false"
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-theme-light-dark"
          @click="toggleTheme"
        >
          Switch to {{ isDarkTheme ? "light" : "dark" }} theme
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-help-circle"
          @click="openAboutDialog = true"
        >
          How To Play
        </v-list-item>
      </v-list>
    </v-menu>
    <v-app-bar-title
      :class="mobile ? 'text-caption' : ''"
      class="pointer"
      @click="router.visit('/')"
    >
      <div class="d-flex flex-row align-center">
        <img
          src="/images/prisoners_dilemma.webp"
          alt="Prisoners Dilemma Logo"
          height="30"
          class="mr-2"
        >
        {{ appName }}
      </div>
    </v-app-bar-title>
    <v-spacer v-if="!mobile" />
    <v-btn
      href="https://github.com/nathanbarrett/PrisonersDilemma"
      target="_blank"
      class="mr-2"
      :size="mobile ? 'x-small' : 'small'"
    >
      <v-icon icon="mdi-github" />
    </v-btn>
    <v-btn
      v-if="!user"
      variant="outlined"
      :size="mobile ? 'x-small' : 'small'"
      @click="router.visit('/register')"
    >
      Register
    </v-btn>
    <v-btn
      v-if="!user"
      id="loginButton"
      variant="plain"
      :size="mobile ? 'x-small' : 'small'"
    >
      Login
    </v-btn>
    <v-btn
      v-if="user"
      variant="plain"
      :size="mobile ? 'x-small' : 'small'"
      href="/logout"
    >
      Logout
    </v-btn>
    <v-dialog
      v-model="openAboutDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title>
          <div class="w-100 d-flex flex-row justify-space-between align-center">
            <div>How To Play</div>
            <v-icon
              size="xs"
              icon="mdi-close"
              @click="openAboutDialog = false"
            />
          </div>
        </v-card-title>
        <v-card-text>
          Inpired by Veritasium's <a
            href="https://www.youtube.com/watch?v=mScpHTIi-kM"
            target="_blank"
          >show on the prisoner's dilemma</a>.
          Watch the video for and in-depth explanation.
          <br><br>
          You score points based on the choices you and your opponent make. Look at the tournament configuration page to see a breakdown of the scoring.
          <br><br>
          Blue title players are prebuilt system players. You can use them in your tournaments but you cannot edit their code.
          <br><br>
          You can also create your own players by clicking the "Create New Player" button.
          <br><br>
          Once you have two or more players selected, you can run a tournament by clicking the "Run Tournament" button.
          <br><br><br><br>
          Made with ❤️ by <a
            href="https://twitter.com/un4tunatetoast"
            target="_blank"
          >Nathan Barrett</a>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<style scoped lang="css">
.pointer {
  cursor: pointer;
}
</style>
