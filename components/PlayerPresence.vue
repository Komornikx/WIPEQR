<template>
	<v-dialog
		v-model="dialog"
		width="1000"
		persistent
		@click:outside="$emit('closePresence')"
	>
		<v-card
			class="tw-text-sm"
			v-if="player"
			min-height="200"
		>
			<v-card-title>{{ player.firstName }} {{ player.lastName }}</v-card-title>
			<v-card-subtitle>Obecność</v-card-subtitle>
			<v-card-text>
				<v-card
					variant="outlined"
					color="blue"
				>
					<v-table density="compact">
						<thead>
							<tr>
								<td>Od</td>
								<td>Do</td>
							</tr>
						</thead>
						<tbody v-if="player.presence.length > 0">
							<tr
								v-for="(presence, i) in player.presence"
								:key="`presence-${i}`"
							>
								<PlayerPresenceRow :presence="presence" />
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td>-</td>
								<td>-</td>
							</tr>
						</tbody>
					</v-table>
				</v-card>
			</v-card-text>
			<v-card-actions class="tw-flex tw-items-center tw-justify-center">
				<v-btn @click="$emit('closePresence')">Ok</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	emits: ['closePresence'],

	computed: {
		dialog() {
			return this.presenceDialog;
		},
	},

	props: {
		player: Object,
		presenceDialog: Boolean,
	},
};
</script>
