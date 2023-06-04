<template>
	<div class="tw-space-x-2 tw-flex">
		<v-btn
			variant="outlined"
			color="blue"
			:loading="generating"
			@click="$emit('generate')"
		>
			<v-icon>mdi-qrcode-scan</v-icon>
			Generuj QR
		</v-btn>
		<v-btn
			variant="outlined"
			color="blue"
			:loading="exporting"
			@click="$emit('export')"
		>
			<v-icon>mdi-export</v-icon>
			Export CSV
		</v-btn>
		<v-btn
			variant="outlined"
			color="blue"
			:loading="importing"
			@click="$emit('import', category)"
		>
			<v-icon>mdi-import</v-icon>
			Import CSV
		</v-btn>

		<div class="tw-grow"></div>

		<v-btn
			variant="outlined"
			color="red"
			:loading="dropping"
			@click="$emit('drop')"
		>
			<v-icon>mdi-delete</v-icon>
			Usuń dane
		</v-btn>
	</div>
	<v-table>
		<thead>
			<tr>
				<th>Imie</th>
				<th>Nazwisko</th>
				<th>Login</th>
				<th>Hasło</th>
				<th>Typ</th>
				<th>Akcja</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="(user, i) in users"
				:key="`user-${i}`"
			>
				<UserRow
					:user="user"
					@remove="$emit('remove', i)"
					@edit="$emit('edit', i)"
				/>
			</tr>
		</tbody>

		<template v-slot:bottom>
			<div
				v-if="users.length <= 0 && !fetching"
				class="tw-flex tw-items-center tw-justify-center tw-p-2"
			>
				Brak organizatorów do wyświetlenia
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
					@click="$emit('add', category)"
					color="green"
					variant="outlined"
					:loading="loading"
					>Dodaj organizatora
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
</template>

<script>
export default {
	emits: [
		'generate',
		'drop',
		'import',
		'export',
		'remove',
		'edit',
		'add',
		'rejectChanges',
		'saveAll',
	],

	props: {
		users: Array,
		loading: Boolean,
		exporting: Boolean,
		dropping: Boolean,
		fetching: Boolean,
		importing: Boolean,
		generating: Boolean,

		pristine: Boolean,
	},
};
</script>
