<template>
  <v-list v-if="admin">
    <v-list-subheader>MENU</v-list-subheader>

    <v-list-item
      v-for="(route, i) in adminRoutes"
      :key="`route-${i}`"
      :to="route.href"
    >
      <v-icon>{{ route.icon }}</v-icon>
      {{ route.name }}
    </v-list-item>
  </v-list>
  <v-list v-if="!admin">
    <v-list-subheader>MENU</v-list-subheader>

    <v-list-item
      v-for="(route, i) in routes"
      :key="`route-${i}`"
      :to="route.href"
    >
      <v-icon>{{ route.icon }}</v-icon>
      {{ route.name }}
    </v-list-item>
  </v-list>
</template>

<script setup>
const adminRoutes = [
  { name: "Gracze", href: "/", icon: "mdi-account" },
  { name: "Widownia", href: "/widownia", icon: "mdi-eye" },
  {
    name: "Organizatorzy",
    href: "/organizatorzy",
    icon: "mdi-shield-account",
  },
];

const routes = [{ name: "Skaner", href: "/test", icon: "mdi-account" }];
</script>

<script>
import { mapStores, mapActions } from "pinia";
import useAuthStore from "~/store/auth";

export default {
  props: {
    admin: Boolean,
  },
};
</script>
