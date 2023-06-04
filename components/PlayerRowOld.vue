<template>
	<td v-if="!player.edit">{{ player.email }}</td>
	<td v-else>
		<v-text-field
			variant="underlined"
			v-model="player.email"
			name="email"
		></v-text-field>
	</td>
	<td v-if="!player.edit">{{ player.firstName }}</td>
	<td v-else>
		<v-text-field
			variant="underlined"
			v-model="player.firstName"
			name="firstName"
		></v-text-field>
	</td>

	<td v-if="!player.edit">{{ player.lastName }}</td>
	<td v-else>
		<v-text-field
			variant="underlined"
			v-model="player.lastName"
			name="lastName"
		></v-text-field>
	</td>

	<td v-if="!player.edit && player.category === 'Liga'">
		<div class="tw-truncate tw-max-w-[9rem]">
			{{ player.team }}
		</div>
	</td>
	<td v-else-if="player.category === 'Liga'">
		<v-text-field
			variant="underlined"
			v-model="player.team"
			name="nick"
		></v-text-field>
	</td>

	<td v-if="!player.edit && player.category !== 'Fifa'">
		<div class="tw-truncate tw-max-w-32">
			{{ player.nick }}
		</div>
	</td>
	<td v-else-if="player.category !== 'Fifa'">
		<v-text-field
			variant="underlined"
			v-model="player.nick"
			name="nick"
		></v-text-field>
	</td>

	<td v-if="!player.edit && !player.type">
		<v-btn
			@click="$emit('showPresence')"
			color="blue"
			variant="text"
			size="small"
			:disabled="player.presence.length <= 0"
		>
			Wyświetl
		</v-btn>
	</td>
	<td v-else></td>
	<td class="tw-space-x-2">
		<v-btn
			@click="$emit('edit')"
			icon
			size="small"
			:color="!player.edit ? 'blue' : 'green'"
			variant="text"
		>
			<v-icon :icon="player.edit ? 'mdi-check' : 'mdi-pen'" />
		</v-btn>
		<v-btn
			@click="$emit('xd')"
			icon
			size="small"
			color="blue"
			variant="text"
		>
			<v-icon icon="mdi-qrcode " />
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
</template>

<script>
export default {
	emits: ['remove', 'edit', 'showPresence'],
	props: {
		player: Object,
		edit: Boolean,
	},
};
</script>
