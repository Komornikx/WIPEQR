<template>
	<div class="tw-space-y-2">
		<v-dialog
			class=""
			v-model="addingPlayer"
		>
			<v-card min-height="400">
				<v-card-title>Dodaj gracza</v-card-title>
				<v-card-text>
					<v-text-field
						name="name"
						label="Imię"
						id="id"
						v-model="newPlayer.firstName"
					></v-text-field>
					<v-text-field
						name="name"
						label="Nazwisko"
						id="id"
						v-model="newPlayer.lastName"
					></v-text-field>
					<v-text-field
						name="name"
						label="E-mail"
						id="id"
						v-model="newPlayer.email"
					></v-text-field>
					<v-text-field
						name="name"
						label="Nick (opcjonalnie)"
						id="id"
						v-model="newPlayer.nick"
					></v-text-field>
					<v-text-field
						name="name"
						label="Drużyna (opcjonalnie)"
						id="id"
						v-model="newPlayer.team"
					></v-text-field>
				</v-card-text>
				<v-card-actions class="tw-flex tw-justify-end tw-w-full">
					<v-btn
						@click="addPlayer"
						color="green"
					>
						Dodaj
					</v-btn>
					<v-btn
						@click="handleAddPlayerCancel"
						color="red"
					>
						Anuluj
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-card>
			<v-tabs
				v-model="tab"
				bg-color="indigo-darken-4"
			>
				<v-tab value="Liga">Liga</v-tab>
				<v-tab value="TFT">TFT</v-tab>
				<v-tab value="Fifa">Fifa</v-tab>
			</v-tabs>

			<v-card-text>
				<v-window v-model="tab">
					<v-window-item
						value="Liga"
						class="tw-space-y-4"
					>
						<ItemsTable
							:items="playersStore.getPlayersByCategory(tab)"
							:pristine="pristineByCategory(tab)"
							:headers="getHeaders(tab)"
							:importing="importing"
							:exporting="exporting"
							:generating="generating"
							:fetching="playersStore.fetching"
							:loading="loading"
							:dropping="dropping"
							:category="tab"
							@saveAll="saveAll"
							@rejectChanges="rejectChanges"
							@handleAddPlayer="handleAddPlayer"
							@handleGenerate="handleGenerate({ category: tab })"
							@handleExport="handleExport({ category: tab })"
							@handleImport="handleImport(tab)"
							@handleDrop="handleDrop({ category: tab })"
							@removePlayer="removePlayer"
							@editPlayer="editPlayer"
							@showPresence="showPresence"
						/>
					</v-window-item>
					<v-window-item
						value="TFT"
						class="tw-space-y-4"
					>
						<ItemsTable
							:items="playersStore.getPlayersByCategory(tab)"
							:pristine="pristineByCategory(tab)"
							:headers="getHeaders(tab)"
							:importing="importing"
							:exporting="exporting"
							:generating="generating"
							:fetching="playersStore.fetching"
							:loading="loading"
							:dropping="dropping"
							:category="tab"
							@saveAll="saveAll"
							@rejectChanges="rejectChanges"
							@handleAddPlayer="handleAddPlayer"
							@handleGenerate="handleGenerate({ category: tab })"
							@handleExport="handleExport({ category: tab })"
							@handleImport="handleImport(tab)"
							@handleDrop="handleDrop({ category: tab })"
							@removePlayer="removePlayer"
							@editPlayer="editPlayer"
							@showPresence="showPresence"
						/>
					</v-window-item>
					<v-window-item
						value="Fifa"
						class="tw-space-y-4"
					>
						<ItemsTable
							:items="playersStore.getPlayersByCategory(tab)"
							:pristine="pristineByCategory(tab)"
							:headers="getHeaders(tab)"
							:importing="importing"
							:exporting="exporting"
							:generating="generating"
							:fetching="playersStore.fetching"
							:loading="loading"
							:dropping="dropping"
							:category="tab"
							@saveAll="saveAll"
							@rejectChanges="rejectChanges"
							@handleAddPlayer="handleAddPlayer"
							@handleGenerate="handleGenerate({ category: tab })"
							@handleExport="handleExport({ category: tab })"
							@handleImport="handleImport(tab)"
							@handleDrop="handleDrop({ category: tab })"
							@removePlayer="removePlayer"
							@editPlayer="editPlayer"
							@showPresence="showPresence"
						/>
					</v-window-item>
				</v-window>
			</v-card-text>
		</v-card>

		<PlayerPresence
			@click="closePresence"
			:player="showPresenceOf"
			:presenceDialog="presenceDialog"
		/>

		<input
			ref="csvinput"
			class="tw-hidden"
			type="file"
			accept=".csv"
			@change="importCSV"
		/>
	</div>
</template>

<script>
import { mapActions, mapStores, mapState } from 'pinia';
import usePlayersStore from '~/store/players';
import { isEqual } from 'lodash';

definePageMeta({
	middleware: 'admin',
});

export default {
	data() {
		return {
			tab: 0,
			importing: false,
			exporting: false,
			generating: false,
			loading: false,
			dropping: false,
			csv: [],

			importCategory: '',

			showPresenceOf: null,
			presenceDialog: false,

			newPlayer: {},
			addingPlayer: false,
		};
	},

	computed: {
		...mapStores(usePlayersStore),

		existingPlayers() {
			return this.playersStore.players.filter((el) => el._id);
		},
	},

	methods: {
		...mapActions(usePlayersStore, [
			'fetchPlayers',
			'editPlayer',
			'removePlayer',
			'rejectChanges',
		]),

		pristineByCategory(category) {
			return isEqual(
				this.playersStore.getPlayersByCategory(category),
				this.playersStore.getPlayersPristineByCategory(category)
			);
		},

		getHeaders(category) {
			let headers = [
				{
					title: 'Team',
					align: 'start',
					key: 'team',
				},
				{
					title: 'Imię',
					key: 'firstName',
				},
				{
					title: 'Nazwisko',
					key: 'lastName',
				},
				{
					title: 'Nick',
					key: 'nick',
				},
				{ title: 'Obecność' },
				{
					title: 'Akcje',
				},
			];

			if (category === 'TFT') {
				headers = headers.filter((el) => el.title != 'Team');
			} else if (category === 'Fifa') {
				headers = headers.filter(
					(el) => el.title != 'Nick' && el.title != 'Team'
				);
			}

			return headers;
		},

		handleAddPlayer(category) {
			this.addingPlayer = true;
			this.newPlayer.category = category;
		},

		handleAddPlayerCancel() {
			this.addingPlayer = false;
			this.newPlayer = {};
		},

		async addPlayer() {
			await $fetch(`${this.$config.public.apiURL}/api/players`, {
				method: 'PUT',
				body: {
					players: [{ ...this.newPlayer }],
					playersToRemove: [],
				},
				headers: {
					authorization: localStorage.getItem('token'),
				},
			});

			await this.handleAddPlayerCancel();
			await this.fetchPlayers();
		},

		async saveAll() {
			this.loading = true;
			await $fetch(`${this.$config.public.apiURL}/api/players`, {
				method: 'PUT',
				body: {
					players: this.playersStore.players,
					playersToRemove: this.playersStore.playersToRemove,
				},
				headers: {
					authorization: localStorage.getItem('token'),
				},
			});
			await this.fetchPlayers();
			this.loading = false;
		},

		async handleGenerate(query) {
			this.generating = true;
			const req = await fetch(
				`${this.$config.public.apiURL}/api/qr/players?${new URLSearchParams(
					query
				).toString()}`,
				{
					headers: {
						accept:
							'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
						'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
						'content-type': 'application/json',
						responsetype: 'arraybuffer',
						'sec-ch-ua':
							'"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
						'sec-ch-ua-mobile': '?0',
						'sec-ch-ua-platform': '"Windows"',
						'sec-fetch-dest': 'empty',
						'sec-fetch-mode': 'cors',
						'sec-fetch-site': 'same-site',
						'upgrade-insecure-requests': '1',
						authorization: localStorage.getItem('token'),
					},
					referrerPolicy: 'strict-origin-when-cross-origin',
					body: null,
					method: 'GET',
					mode: 'cors',
					credentials: 'omit',
				}
			);

			if (req.status != 200) {
				return (this.generating = false);
			}

			const blob = await req.blob();
			const url = URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = url;
			link.download = 'qr.zip';
			link.click();
			this.generating = false;
		},

		async handleImport(category) {
			this.importCategory = category;
			this.$refs.csvinput.click();
		},

		async handleExport(query) {
			this.exporting = true;
			const csv = await $fetch(
				`${this.$config.public.apiURL}/api/players/csv?${new URLSearchParams(
					query
				).toString()}`,
				{
					headers: {
						authorization: localStorage.getItem('token'),
					},
				}
			);
			const blob = new Blob([csv]);
			const a = document.createElement('a');
			a.href = window.URL.createObjectURL(blob);
			a.download = 'players.csv';
			a.click();
			this.exporting = false;
		},

		async handleDrop(query) {
			if (!confirm('Na pewno?')) return;
			await $fetch(
				`${this.$config.public.apiURL}/api/players?${new URLSearchParams(
					query
				).toString()}`,
				{
					method: 'DELETE',
					headers: {
						authorization: localStorage.getItem('token'),
					},
				}
			);

			await this.fetchPlayers();
		},

		async importCSV(e) {
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
			const x = txt.split('\n');
			for (const el of x) {
				const y = el.split(',');
				if (y[0] && y[0] !== 'id') {
					arr.push({
						id: y[0],
						email: y[1],
						firstName: y[5].split(' ')[0],
						lastName: y[5].split(' ')[1],
						team: y[9],
						nick: y[10],
						category: this.importCategory,
					});
				}
			}

			try {
				await $fetch(`${this.$config.public.apiURL}/api/players/csv`, {
					method: 'POST',
					body: {
						players: arr,
					},
					headers: {
						authorization: localStorage.getItem('token'),
					},
				});
			} catch (err) {
				console.log(err);
			}

			this.importing = false;
			await this.fetchPlayers();
		},

		showPresence(player) {
			this.showPresenceOf = player;
			this.presenceDialog = true;
		},

		closePresence() {
			this.showPresenceOf = null;
			this.presenceDialog = false;
		},
	},
};
</script>
