<template>
  <div v-if="fetching">
    <v-progress-linear color="blue" :indeterminate="true"></v-progress-linear>
  </div>
  <div v-else-if="!fetching" class="tw-space-y-4">
    <div class="tw-space-x-2 tw-flex">
      <v-btn
        variant="outlined"
        color="blue"
        :loading="generating"
        :disabled="items.length <= 0"
        @click="$emit('handleGenerate')"
      >
        <v-icon>mdi-qrcode-scan</v-icon>
        <span v-if="$vuetify.display.width > 600">Generuj QR</span>
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue"
        :loading="exporting"
        :disabled="items.length <= 0"
        @click="$emit('handleExport')"
      >
        <v-icon>mdi-export</v-icon>
        <span v-if="$vuetify.display.width > 600">Export CSV</span>
      </v-btn>
      <v-btn
        variant="outlined"
        color="blue"
        :loading="importing"
        @click="$emit('handleImport', category)"
      >
        <v-icon>mdi-import</v-icon>
        <span v-if="$vuetify.display.width > 600">Import CSV</span>
      </v-btn>

      <div class="tw-grow"></div>

      <v-btn
        variant="outlined"
        color="red"
        :loading="dropping"
        :disabled="items.length <= 0"
        @click="$emit('handleDrop')"
      >
        <v-icon>mdi-delete</v-icon>
        <span v-if="$vuetify.display.width > 600">Usuń dane</span>
      </v-btn>
    </div>

    <div
      v-if="items.length <= 0"
      class="tw-flex tw-items-center tw-justify-center tw-p-2"
    >
      Brak osób do wyświetlenia
    </div>
    <div class="tw-space-y-4" v-else>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>

      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="items"
        :search="search"
        density="compact"
        class="elevation-1"
      >
        <template v-slot:item="{ item }">
          <ItemRow
            :item="item.raw"
            :category="category"
            @remove="$emit('removePlayer', item.raw)"
            @edit="$emit('editPlayer', item.raw)"
            @showPresence="$emit('showPresence', item.raw)"
          />
        </template>
      </v-data-table>
    </div>
  </div>
  <div>
    <div class="tw-w-full tw-p-2 tw-space-y-2">
      <v-btn
        class="tw-w-full"
        @click="$emit('handleAddPlayer', category)"
        color="green"
        variant="outlined"
        :loading="loading"
      >
        Dodaj osobę
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <div v-if="!pristine" class="tw-space-x-2 tw-flex tw-justify-end">
        <v-btn
          variant="outlined"
          @click="$emit('saveAll')"
          color="blue"
          :loading="loading"
          >Zapisz wszystkie zmiany
          <v-icon>mdi-pen</v-icon>
        </v-btn>
        <v-btn
          variant="outlined"
          @click="$emit('rejectChanges')"
          color="red"
          :loading="loading"
          >Odrzuć zmiany
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: [
    "saveAll",
    "rejectChanges",
    "handleAddPlayer",
    "handleGenerate",
    "handleExport",
    "handleImport",
    "handleDrop",
    "importcsv",
    "removePlayer",
    "editPlayer",
    "showPresence",
  ],
  data() {
    return {
      search: "",
      itemsPerPage: 10,
    };
  },

  props: {
    items: Array,
    headers: Array,
    category: String,
    pristine: Boolean,
    importing: Boolean,
    exporting: Boolean,
    generating: Boolean,
    fetching: Boolean,
    loading: Boolean,
    dropping: Boolean,
    category: String,
  },
};
</script>
