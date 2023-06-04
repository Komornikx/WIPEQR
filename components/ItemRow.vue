<template>
  <tr>
    <td v-if="!item.edit && item.category === 'Liga'">
      <div class="tw-truncate tw-max-w-[9rem]">
        {{ item.team }}
      </div>
    </td>
    <td v-else-if="item.category === 'Liga'">
      <v-text-field
        variant="underlined"
        v-model="item.team"
        name="nick"
      ></v-text-field>
    </td>
    <td v-if="!item.edit">{{ item.firstName }}</td>
    <td v-else>
      <v-text-field
        variant="underlined"
        v-model="item.firstName"
        name="firstName"
      ></v-text-field>
    </td>

    <td v-if="!item.edit">{{ item.lastName }}</td>
    <td v-else>
      <v-text-field
        variant="underlined"
        v-model="item.lastName"
        name="lastName"
      ></v-text-field>
    </td>

    <td
      v-if="
        !item.edit &&
        item.category !== 'Fifa' &&
        category !== 'viewer' &&
        category !== 'honorable' &&
        category !== 'vip'
      "
    >
      <div class="tw-truncate tw-max-w-32">
        {{ item.nick }}
      </div>
    </td>
    <td
      v-else-if="
        item.category !== 'Fifa' &&
        category !== 'viewer' &&
        category !== 'honorable' &&
        category !== 'vip'
      "
    >
      <v-text-field
        variant="underlined"
        v-model="item.nick"
        name="nick"
      ></v-text-field>
    </td>

    <td>
      <v-btn
        @click="$emit('showPresence')"
        variant="text"
        size="xsmall"
        color="blue"
        :disabled="item.presence.length <= 0"
      >
        Wyświetl
      </v-btn>
    </td>

    <td class="tw-space-x-2">
      <v-btn
        @click="$emit('edit')"
        icon
        size="small"
        :color="!item.edit ? 'blue' : 'green'"
        variant="text"
      >
        <v-icon :icon="item.edit ? 'mdi-check' : 'mdi-pen'" />
      </v-btn>
      <v-btn
        @click="$emit('remove')"
        icon
        size="small"
        color="red"
        variant="text"
      >
        <v-icon icon="mdi-delete " />
      </v-btn>
    </td>
  </tr>
</template>
<script>
export default {
  emits: ["remove", "edit", "showPresence"],
  props: {
    item: Object,
    category: String,
  },
};
</script>
