<template>
  <div>
    <v-progress-linear
      v-if="fetching"
      :indeterminate="true"
    ></v-progress-linear>
    <v-card v-else>
      <div v-if="!ticket">Nie znaleziono w bazie</div>
      <div v-else>
        <div v-if="!ticket.registered && ticket.type">
          <v-card-text> Niezarejestrowano! </v-card-text>
        </div>
        <div v-else>
          <v-card-title>
            <div :class="`tw-text-2xl`">
              {{ ticket.firstName }} {{ ticket.lastName }}
            </div>
          </v-card-title>

          <v-card-text>
            <div :class="`tw-text-${typeColor}-500 tw-text-xl`">
              <div>
                {{ displayCategory || displayType }}
              </div>
              <div v-if="ticket.category === 'Liga'">
                {{ ticket.team ? `Team: ${ticket.team}` : "" }}
              </div>
              <div>
                {{ ticket.nick ? `Nick: ${ticket.nick}` : "" }}
              </div>
            </div>
          </v-card-text>
          <v-card-actions v-if="ticket.type !== 'user'">
            <v-btn
              v-if="setEntrance"
              variant="outlined"
              color="green"
              @click="handlePresence"
              :loading="setting"
            >
              Zaznacz wejście
            </v-btn>
            <v-btn
              v-else
              variant="outlined"
              color="red"
              @click="handlePresence"
              :loading="setting"
              :disabled="set"
            >
              Zaznacz wyjście
            </v-btn>
          </v-card-actions>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import useAuthStore from "~/store/auth";
import { mapStores } from "pinia";

export default {
  data() {
    return {
      fetching: false,
      ticket: null,

      setting: false,
      set: false,
    };
  },

  computed: {
    ...mapStores(useAuthStore),
    setEntrance() {
      return (
        this.ticket.presence.length <= 0 ||
        !this.ticket.presence.slice(-1)[0].from ||
        this.ticket.presence.slice(-1)[0].to
      );
    },

    typeColor() {
      switch (this.ticket.type) {
        case "admin":
          return "red";
          break;
        case "normal":
          return "yellow";
          break;
        case "viewer":
          return "gray";
          break;
        case "honorable":
          return "amber";
          break;
        case "VIP":
          return "amber";
          break;
        case "player":
          return "blue";
          break;
        default:
          return "gray";
          break;
      }
    },

    displayCategory() {
      switch (this.ticket.category) {
        case "Liga":
          return "Gracz: League of legends";
          break;
        case "TFT":
          return "Gracz: TFT";
          break;
        case "Fifa":
          return "Gracz: Fifa";
          break;
        default:
          return "";
          break;
      }
    },

    displayType() {
      switch (this.ticket.type) {
        case "viewer":
          return "Obserwujący";
          break;
        case "honorable":
          return "Gość honorowy";
          break;
        case "vip":
          return "VIP";
          break;
        case "admin":
        case "normal":
          return "Organizator";
          break;
      }
    },
  },

  async beforeMount() {
    await this.fetchTicket();
    if (
      this.ticket.type &&
      !this.ticket.registered &&
      this.authStore.user.type === "admin"
    ) {
      return navigateTo(`/qr/${this.$route.params.id}/rejestracja`);
    }
  },

  methods: {
    async handlePresence() {
      if (!this.setEntrance && !confirm("Zaznaczyć wyjście?")) {
        return;
      }

      if (this.setEntrance && !confirm("Zaznaczyć wejście?")) {
        return;
      }
      await this.setPresence();
      await this.fetchTicket();
    },

    async setPresence() {
      this.setting = true;
      try {
        await $fetch(
          `${this.$config.public.apiURL}/api/qr/presence/${this.$route.params.id}`,
          {
            method: "POST",
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        );
      } catch (err) {
        console.log(err);
        alert("błąd przy zaznaczeniu obecności");
      }
      this.setting = false;
    },

    async fetchTicket() {
      this.fetching = true;
      const ticket = await $fetch(
        `${this.$config.public.apiURL}/api/qr/${this.$route.params.id}`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      this.ticket = ticket;
      this.fetching = false;
    },
  },
};
</script>
