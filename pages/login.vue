<template>
  <div class="tw-h-full tw-flex tw-justify-center tw-items-center">
    <v-card width="300" height="300">
      <div class="tw-h-full tw-flex tw-flex-col">
        <v-card-text>
          <v-text-field
            v-model="user.login"
            name="login"
            label="Login"
            id="login"
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            name="password"
            label="Hasło"
            id="password"
            type="password"
            @keydown.enter="handleLogin"
          ></v-text-field>
          <div class="tw-h-4 tw-text-red-500 tw-text-center">{{ error }}</div>
        </v-card-text>
        <div class="tw-grow"></div>
        <v-card-actions>
          <div class="tw-w-full tw-text-center">
            <v-btn
              color="success"
              variant="outlined"
              @click="handleLogin"
              :loading="loading"
            >
              Zaloguj się
            </v-btn>
          </div>
        </v-card-actions>
        <div class="tw-grow"></div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import useAuthStore from "~/store/auth";

definePageMeta({
  layout: "login",
});

export default {
  data() {
    return {
      user: {
        login: "",
        password: "",
      },
      loading: false,
      error: "",
    };
  },

  methods: {
    ...mapActions(useAuthStore, ["login"]),
    async handleLogin() {
      this.error = "";
      this.loading = true;
      try {
        await this.login(this.user, this.$route.query.redirect);
      } catch (err) {
        console.log(err);
        this.error = "Błędny login lub hasło";
      }
      this.loading = false;
    },
  },
};
</script>
