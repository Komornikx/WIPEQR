<template>
  <v-app app theme="dark">
    <v-navigation-drawer
      v-model="drawer"
      app
      color="indigo-darken-4"
      class="accent-4"
    >
      <Navigation :admin="isAdmin" />

      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="handleLogout" block> Wyloguj </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar app elevation="0">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <div class="tw-space-x-2" v-if="isAdmin">
        <v-chip
          variant="outlined"
          color="cyan"
          prepend-icon="mdi-account"
          @click="$router.push('/')"
        >
          <span v-if="$vuetify.display.width > 600">Gracze: </span>
          {{ playersStore.players.length }}
        </v-chip>
        <v-chip
          variant="outlined"
          color="gray"
          prepend-icon="mdi-eye"
          @click="$router.push('/widownia')"
        >
          <span v-if="$vuetify.display.width > 600">Zarejestrowano: </span>
          {{ getRegisteredTickets().length || 0 }}
        </v-chip>
        <v-chip
          variant="outlined"
          color="red"
          prepend-icon="mdi-shield-account"
          @click="$router.push('/organizatorzy')"
        >
          <span v-if="$vuetify.display.width > 600">Organizatorzy: </span>
          {{ usersStore.users.length || 0 }}
        </v-chip>
      </div>
    </v-app-bar>
    <v-main app>
      <slot class="tw-p-2" />
    </v-main>
  </v-app>
</template>

<script>
import { mapStores, mapActions, mapState } from "pinia";
import useAuthStore from "~/store/auth";
import useTicketsStore from "~/store/tickets";
import usePlayersStore from "~/store/players";
import useUsersStore from "~/store/users";

export default {
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    ...mapStores(useAuthStore),
    ...mapStores(useTicketsStore),
    ...mapStores(usePlayersStore),
    ...mapStores(useUsersStore),
    ...mapState(useTicketsStore, ["getRegisteredTickets"]),

    isAdmin() {
      return this.authStore.user.type === "admin";
    },

    allScans() {
      const players = this.playersStore.players;
      const tickets = this.ticketsStore.tickets;
      let scans = 0;

      for (const player of players) {
        scans += player.presence.length;
      }

      for (const ticket of tickets) {
        scans += ticket.presence.length;
      }

      for (const ticket of tickets.filter(
        (el) => el.registered && el.type === "viewer"
      )) {
        scans += 1;
      }

      return scans;
    },
  },

  async beforeMount() {
    await this.me();
    if (this.isAdmin) {
      await this.fetchTickets();
      await this.fetchPlayers();
      await this.fetchUsers();
    }
  },

  methods: {
    ...mapActions(useAuthStore, ["me", "logout"]),
    ...mapActions(useTicketsStore, ["fetchTickets"]),
    ...mapActions(usePlayersStore, ["fetchPlayers"]),
    ...mapActions(useUsersStore, ["fetchUsers"]),

    async handleLogout() {
      await this.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
* {
  font-family: "Source Sans Pro", sans-serif;
}
</style>
