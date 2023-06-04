<template>
	<div class="tw-p-2">
		<v-card>
			<v-card-title>Rejestrowany bilet: {{ $route.params.id }}</v-card-title>
			<v-card-actions class="">
				<div class="tw-flex tw-flex-col tw-w-full">
					<v-text-field
						v-model="firstName"
						name="firstName"
						label="Imię"
						id="firstName"
					></v-text-field>
					<v-text-field
						v-model="lastName"
						name="lastName"
						label="Nazwisko"
						id="lastName"
					></v-text-field>
					<v-btn
						color="success"
						variant="outlined"
						@click="register"
						>Zarejestruj</v-btn
					>
				</div>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script>
definePageMeta({
	middleware: 'admin',
});

export default {
	data() {
		return {
			firstName: '',
			lastName: '',
			ticket: '',
		};
	},

	async beforeMount() {
		await this.fetchTicket();
		if (this.ticket.type === 'viewer' && this.ticket.registered) {
			navigateTo(`/qr/${this.$route.params.id}`);
		}
	},

	methods: {
		async fetchTicket() {
			this.fetching = true;
			const ticket = await $fetch(
				`${this.$config.public.apiURL}/api/qr/${this.$route.params.id}`,
				{
					headers: {
						authorization: localStorage.getItem('token'),
					},
				}
			);
			this.ticket = ticket;
			this.fetching = false;
		},

		async register() {
			this.registering = true;
			try {
				await $fetch(
					`${this.$config.public.apiURL}/api/tickets/${this.$route.params.id}/register`,
					{
						method: 'PUT',
						body: {
							firstName: this.firstName,
							lastName: this.lastName,
						},
						headers: {
							authorization: localStorage.getItem('token'),
						},
					}
				);
			} catch (err) {
				return console.log(err);
			}

			this.registering = false;
			navigateTo(`/qr/${this.$route.params.id}`);
		},
	},
};
</script>
