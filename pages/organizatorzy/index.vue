<template>
  <div class="tw-space-y-2">
    <UsersTable
      @remove="removeUser"
      @edit="editUser"
      @add="addUser"
      @generate="handleGenerate"
      @drop="handleDrop"
      @import="handleImport"
      @export="handleExport"
      @saveAll="saveAll"
      @rejectChanges="rejectChanges"
      :users="usersStore.users"
      :pristine="pristine"
    />
  </div>
</template>

<script>
import { mapActions, mapStores } from "pinia";
import useUsersStore from "~/store/users";
import { isEqual } from "lodash";

export default {
  data() {
    return {
      importing: false,
      exporting: false,
      generating: false,
      dropping: false,
      fetching: false,
      loading: false,
      csv: [],

      showPresenceOf: null,
      presenceDialog: false,
    };
  },

  computed: {
    ...mapStores(useUsersStore),

    pristine() {
      return isEqual(this.usersStore.users, this.usersStore.usersPristine);
    },
  },

  methods: {
    ...mapActions(useUsersStore, [
      "fetchUsers",
      "addUser",
      "removeUser",
      "editUser",
      "rejectChanges",
    ]),

    async saveAll() {
      console.log(this.usersStore.users);

      this.loading = true;
      await $fetch(`${this.$config.public.apiURL}/api/users`, {
        method: "PUT",
        body: {
          users: this.usersStore.users,
          usersToRemove: this.usersStore.usersToRemove,
        },
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });
      await this.fetchUsers();
      this.loading = false;
    },

    async handleGenerate(query) {
      this.generating = true;
      const req = await fetch(
        `${this.$config.public.apiURL}/api/qr/users?${new URLSearchParams(
          query
        ).toString()}`,
        {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/json",
            responsetype: "arraybuffer",
            "sec-ch-ua":
              '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "upgrade-insecure-requests": "1",
            authorization: localStorage.getItem("token"),
          },
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "omit",
        }
      );

      if (req.status != 200) {
        return (this.generating = false);
      }

      const blob = await req.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "qr.zip";
      link.click();
      this.generating = false;
    },

    async handleImport() {
      this.$refs.csvinput.click();
    },

    async handleExport(query) {
      this.exporting = true;
      const csv = await $fetch(
        `${this.$config.public.apiURL}/api/users/csv?${new URLSearchParams(
          query
        ).toString()}`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );
      const blob = new Blob([csv]);
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = "users.csv";
      a.click();
      this.exporting = false;
    },

    async handleDrop() {
      if (!confirm("Na pewno?")) return;
      await $fetch(`${this.$config.public.apiURL}/api/users?type=organizer`, {
        method: "DELETE",
        headers: {
          authorization: localStorage.getItem("token"),
        },
      });

      await this.fetchUsers();
    },

    async onFileChange(e) {
      this.importing = true;
      const file = e.target.files[0];

      const readText = async (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsText(file);
        });

      const txt = await readText(file);
      const arr = [];
      const x = txt.split("\n");

      for (const el of x) {
        const y = el.split(",");
        if (y[0]) {
          arr.push({
            _id: y[0],
            firstName: y[1],
            lastName: y[2],
            nick: y[3],
            type: "normal",
          });
        }
      }

      try {
        await $fetch(`${this.$config.public.apiURL}/api/users/csv`, {
          method: "POST",
          body: {
            users: arr,
          },
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });
      } catch (err) {
        console.log(err);
      }

      this.importing = false;
      await this.fetchUsers();
    },

    showPresence(i) {
      this.showPresenceOf = this.organizers[i];
      this.presenceDialog = true;
    },

    closePresence() {
      this.showPresenceOf = null;
      this.presenceDialog = false;
    },
  },
};
</script>
