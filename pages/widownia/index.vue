<template>
	<div class="tw-p-2 tw-space-y-2">
		<div class="tw-space-x-2 tw-flex">
			<v-btn
				variant="outlined"
				color="blue"
				:loading="generating"
				:disabled="availableTickets.length <= 0"
				@click="handleGenerate({ registered: false, type: 'viewer' })"
			>
				<v-icon>mdi-qrcode-scan</v-icon>
				<div>Generuj puste QR</div>
			</v-btn>
			<v-btn
				color="blue"
				variant="outlined"
				@click="addNewTickets"
				:loading="adding"
			>
				Dodaj nowe bilety
			</v-btn>
			<div class="tw-w-48">
				<v-select
					hide-details
					class="ma-0 pa-0"
					type="number"
					variant="underlined"
					density="compact"
					:items="ticketsSelect"
					v-model="amountToAdd"
				></v-select>
			</div>
			<v-btn
				variant="outlined"
				color="blue"
				:loading="exporting"
				@click="handleExport({ registered: false })"
			>
				<v-icon>mdi-export</v-icon>
				Export CSV
			</v-btn>
			<div class="tw-grow"></div>
			<v-btn
				variant="outlined"
				color="red"
				:loading="dropping"
				:disabled="availableTickets.length <= 0"
				@click="handleDrop(false)"
			>
				<v-icon>mdi-delete</v-icon>
				Usuń dane
			</v-btn>
		</div>
		<v-card
			variant="outlined"
			color="blue"
			background="gray"
			elevation="10"
		>
			<div class="tw-bg-neutral-800 tw-p-3 tw-text-xl">
				Dostępne bilety: {{ availableTickets.length }}
			</div>
		</v-card>
		<v-card>
			<v-tabs
				v-model="tab"
				bg-color="indigo-darken-4"
			>
				<v-tab value="viewer">Widownia</v-tab>
				<v-tab value="honorable">Honorowi</v-tab>
				<v-tab value="vip">VIP</v-tab>
			</v-tabs>
			<v-card-text>
				<v-window v-model="tab">
					<v-window-item
						value="viewer"
						class="tw-space-y-4"
					>
						<ItemsTable
							:items="ticketsStore.getRegisteredTicketsByType(tab)"
							:headers="getHeaders(tab)"
							:pristine="pristineByTab(tab)"
							:importing="importing"
							:exporting="exporting"
							:generating="generating"
							:fetching="ticketsStore.fetching"
							:loading="loading"
							:dropping="dropping"
							:category="tab"
							@saveAll="saveAll"
							@rejectChanges="rejectChanges"
							@handleAddPlayer="handleAdd(tab)"
							@handleGenerate="handleGenerate({ type: tab, registered: true })"
							@handleExport="handleExport({ type: tab, registered: true })"
							@handleImport="handleImport(tab)"
							@handleDrop="handleDrop({ type: tab, registered: true })"
							@removePlayer="removeTicket"
							@editPlayer="editTicket"
							@showPresence="showPresence"
						/>
					</v-window-item>
					<v-window-item
						value="honorable"
						class="tw-space-y-4"
					>
						<ItemsTable
							:items="ticketsStore.getRegisteredTicketsByType(tab)"
							:headers="getHeaders(tab)"
							:pristine="pristineByTab(tab)"
							:importing="importing"
							:exporting="exporting"
							:generating="generating"
							:fetching="ticketsStore.fetching"
							:loading="loading"
							:dropping="dropping"
							:category="tab"
							@saveAll="saveAll"
							@rejectChanges="rejectChanges"
							@handleAddPlayer="handleAdd"
							@handleGenerate="handleGenerate({ type: tab, registered: true })"
							@handleExport="handleExport({ type: tab, registered: true })"
							@handleImport="handleImport(tab)"
							@handleDrop="handleDrop({ type: tab, registered: true })"
							@removePlayer="removeTicket"
							@editPlayer="editTicket"
							@showPresence="showPresence"
						/>
					</v-window-item>
					<v-window-item
						value="vip"
						class="tw-space-y-4"
					>
						<ItemsTable
							:items="ticketsStore.getRegisteredTicketsByType(tab)"
							:headers="getHeaders(tab)"
							:pristine="pristineByTab(tab)"
							:importing="importing"
							:exporting="exporting"
							:generating="generating"
							:fetching="ticketsStore.fetching"
							:loading="loading"
							:dropping="dropping"
							:category="tab"
							@saveAll="saveAll"
							@rejectChanges="rejectChanges"
							@handleAddPlayer="handleAdd"
							@handleGenerate="handleGenerate({ type: tab, registered: true })"
							@handleExport="handleExport({ type: tab, registered: true })"
							@handleImport="handleImport(tab)"
							@handleDrop="handleDrop({ type: tab, registered: true })"
							@removePlayer="removeTicket"
							@editPlayer="editTicket"
							@showPresence="showPresence"
						/>
					</v-window-item>
				</v-window>
			</v-card-text>
		</v-card>
	</div>

	<v-dialog v-model="addingHonorable">
		<v-card min-height="400">
			<v-card-title>Dodaj gracza</v-card-title>
			<v-card-text>
				<v-text-field
					name="name"
					label="Imię"
					id="id"
					v-model="newTicket.firstName"
				></v-text-field>
				<v-text-field
					name="name"
					label="Nazwisko"
					id="id"
					v-model="newTicket.lastName"
				></v-text-field>
			</v-card-text>
			<v-card-actions class="tw-flex tw-justify-end tw-w-full">
				<v-btn
					@click="addHonorable"
					color="green"
				>
					Dodaj
				</v-btn>
				<v-btn
					@click="handleAddCancel"
					color="red"
				>
					Anuluj
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

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
</template>

<script>
import { isEqual } from 'lodash';
import { mapActions, mapStores } from 'pinia';
import useTicketsStore from '~/store/tickets';

export default {
	data() {
		return {
			ticketsSelect: [1, 10, 50, 100, 1000, 2000, 5000],
			amountToAdd: 1,
			tab: 1,
			importing: false,
			exporting: false,
			generating: false,
			dropping: false,

			loading: false,
			adding: false,

			presenceDialog: false,
			showPresenceOf: null,
			addingHonorable: false,
			newTicket: {
				firstName: '',
				lastName: '',
			},
		};
	},

	computed: {
		...mapStores(useTicketsStore),
		availableTickets() {
			return this.ticketsStore.tickets.filter((el) => !el.registered);
		},

		registeredTickets() {
			return this.ticketsStore.tickets.filter((el) => el.registered);
		},
	},

	methods: {
		...mapActions(useTicketsStore, [
			'fetchTickets',
			'removeTicket',
			'editTicket',
			'rejectChanges',
		]),

		getHeaders(category) {
			let headers = [
				{
					title: 'Imię',
					align: 'start',
					key: 'firstName',
				},
				{
					title: 'Nazwisko',
					key: 'lastName',
				},
				{
					title: 'Obecność',
				},
				{
					title: 'Akcje',
				},
			];

			return headers;
		},

		pristineByTab(tab) {
			return isEqual(
				this.ticketsStore.getRegisteredTicketsByType(tab),
				this.ticketsStore.getTicketsPristineByType(tab)
			);
		},

		async handleGenerate(query) {
			this.generating = true;
			const req = await fetch(
				`${this.$config.public.apiURL}/api/qr/tickets?${new URLSearchParams(
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

		async handleAdd(tab) {
			this.addingHonorable = true;
			this.newTicket.type = tab;
		},

		async handleAddCancel() {
			this.addingHonorable = false;
			this.newTicket = {
				...this.newTicket,
				firstName: '',
				lastName: '',
			};
		},

		async addHonorable() {
			await $fetch(`${this.$config.public.apiURL}/api/tickets`, {
				method: 'PUT',
				body: {
					tickets: [{ ...this.newTicket }],
					ticketsToRemove: [],
				},
				headers: {
					authorization: localStorage.getItem('token'),
				},
			});

			await this.handleAddCancel();
			await this.fetchTickets();
		},

		async addNewTickets() {
			this.adding = true;
			await $fetch(`${this.$config.public.apiURL}/api/tickets`, {
				method: 'POST',
				body: {
					amount: this.amountToAdd,
				},
				headers: {
					authorization: localStorage.getItem('token'),
				},
			});
			await this.fetchTickets({ type: 'viewer' });

			this.adding = false;
		},

		async handleDrop(query) {
			this.dropping = true;
			if (!confirm('Na pewno?')) return;

			await $fetch(
				`${this.$config.public.apiURL}/api/tickets?${new URLSearchParams(
					query
				).toString()}`,
				{
					method: 'DELETE',
					headers: {
						authorization: localStorage.getItem('token'),
					},
				}
			);

			await this.fetchTickets({ type: 'viewer' });
			this.dropping = false;
		},

		async saveAll() {
			this.loading = true;
			await $fetch(`${this.$config.public.apiURL}/api/tickets`, {
				method: 'PUT',
				body: {
					tickets: this.ticketsStore.tickets,
					ticketsToRemove: this.ticketsStore.ticketsToRemove,
				},
				headers: {
					authorization: localStorage.getItem('token'),
				},
			});
			await this.fetchTickets();
			this.loading = false;
		},

		showPresence(item) {
			this.showPresenceOf = item;
			this.presenceDialog = true;
		},

		closePresence() {
			this.showPresenceOf = null;
			this.presenceDialog = false;
		},

		async handleExport(query) {
			this.exporting = true;
			const csv = await $fetch(
				`${this.$config.public.apiURL}/api/tickets/csv?${new URLSearchParams(
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
			a.download = 'tickets.csv';
			a.click();
			this.exporting = false;
		},

		async handleImport(category) {
			this.importCategory = category;
			this.$refs.csvinput.click();
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
			const keys = x[0].split(',');

			for (const el of x) {
				const y = el.split(',');
				if (y[0] && y[0] !== 'id') {
					arr.push({
						// _id: y[0],
						firstName: y[0],
						lastName: y[1],
						type: this.importCategory,
						registered: true,
					});
				}
			}

			try {
				await $fetch(`${this.$config.public.apiURL}/api/tickets/csv`, {
					method: 'POST',
					body: {
						tickets: arr,
					},
					headers: {
						authorization: localStorage.getItem('token'),
					},
				});
			} catch (err) {
				console.log(err);
			}

			this.importing = false;
			await this.fetchTickets();
		},
	},
};
</script>
