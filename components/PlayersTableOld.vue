<template>
	<div class="tw-space-x-2 tw-flex">
		<v-btn
			variant="outlined"
			color="blue"
			:loading="generating"
			:disabled="existingPlayers.length <= 0"
			@click="$emit('handleGenerate')"
		>
			<v-icon>mdi-qrcode-scan</v-icon>
			Generuj QR
		</v-btn>
		<v-btn
			variant="outlined"
			color="blue"
			:loading="exporting"
			:disabled="existingPlayers.length <= 0"
			@click="$emit('handleExport')"
		>
			<v-icon>mdi-export</v-icon>
			Export CSV
		</v-btn>
		<v-btn
			variant="outlined"
			color="blue"
			:loading="importing"
			@click="$emit('handleImport', category)"
		>
			<v-icon>mdi-import</v-icon>
			Import CSV
		</v-btn>

		<div class="tw-grow"></div>

		<v-btn
			variant="outlined"
			color="red"
			:loading="dropping"
			:disabled="existingPlayers.length <= 0"
			@click="$emit('handleDrop')"
		>
			<v-icon>mdi-delete</v-icon>
			Usuń dane
		</v-btn>
	</div>

	<v-card
		variant="outlined"
		color="blue"
		elevation="10"
	>
		<v-table
			density="compact"
			:hover="true"
		>
			<thead>
				<tr>
					<th>Email</th>
					<th>Imię</th>
					<th>Nazwisko</th>
					<th v-if="category === 'Liga'">Team</th>
					<th v-if="category !== 'Fifa'">Nick</th>
					<th v-if="category !== 'organizers'">Obecność</th>
					<th>Akcja</th>
				</tr>
			</thead>
			<tbody v-if="players.length > 0">
				<tr
					v-for="(player, i) in players"
					:key="`player-${i}`"
				>
					<PlayerRow
						:player="player"
						@remove="$emit('removePlayer', player)"
						@edit="$emit('editPlayer', player)"
						@showPresence="$emit('showPresence', player)"
					/>
				</tr>
			</tbody>
			<template v-slot:bottom>
				<div
					v-if="players.length <= 0 && !fetching"
					class="tw-flex tw-items-center tw-justify-center tw-p-2"
				>
					<span v-if="category !== 'organizers'">
						Brak graczy do wyświetlenia
					</span>
					<span v-else> Brak organizatorów do wyświetlenia </span>
				</div>
				<div v-else-if="fetching">
					<v-progress-linear
						color="blue"
						:indeterminate="true"
					></v-progress-linear>
				</div>
				<div class="tw-w-full tw-p-2 tw-space-y-2">
					<v-btn
						class="tw-w-full"
						@click="$emit('handleAddPlayer', category)"
						color="green"
						variant="outlined"
						:loading="loading"
						>Dodaj Gracza
						<v-icon>mdi-plus</v-icon>
					</v-btn>
					<div
						v-if="!pristine"
						class="tw-space-x-2 tw-flex tw-justify-end"
					>
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
			</template>
		</v-table>
	</v-card>
</template>

<script>
export default {
	emits: [
		'saveAll',
		'rejectChanges',
		'handleAddPlayer',
		'handleGenerate',
		'handleExport',
		'handleImport',
		'handleDrop',
		'importcsv',
		'removePlayer',
		'editPlayer',
		'showPresence',
	],
	data() {
		return {};
	},

	props: {
		players: Array,
		existingPlayers: Array,
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
