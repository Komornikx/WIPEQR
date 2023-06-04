import { defineStore } from 'pinia';

const useTicketsStore = defineStore('tickets', {
	state: () => ({
		tickets: [],
		ticketsPristine: [],
		ticketsToRemove: [],

		fetching: false,
	}),

	getters: {
		getRegisteredTickets: (state) => {
			return () => state.tickets.filter((el) => el.registered);
		},

		getRegisteredTicketsByType: (state) => {
			return (type) =>
				state.tickets.filter(
					(el) => el.type === type && el.registered === true
				);
		},

		getTicketsPristineByType: (state) => {
			return (type) =>
				state.ticketsPristine.filter(
					(el) => el.type === type && el.registered == true
				);
		},
	},

	actions: {
		async fetchTickets(query) {
			this.fetching = true;
			const data = await $fetch(
				`${useRuntimeConfig().public.apiURL}/api/tickets?${new URLSearchParams(
					query
				).toString()}`,
				{
					headers: {
						authorization: localStorage.getItem('token'),
					},
				}
			);
			this.tickets = data;
			this.ticketsPristine = data;

			this.fetching = false;
		},

		removeTicket(ticket) {
			if (this.tickets.filter((el) => el === ticket)[0]._id) {
				this.ticketsToRemove.push(
					this.tickets.filter((el) => el === ticket)[0]._id
				);
			}
			this.tickets = this.tickets.filter((el) => el !== ticket);
		},

		editTicket(ticket) {
			this.tickets.filter((el) => el === ticket)[0].edit = !this.tickets.filter(
				(el) => el === ticket
			)[0].edit;
		},

		rejectChanges() {
			this.tickets = JSON.parse(JSON.stringify(this.ticketsPristine));
		},
	},
});

export default useTicketsStore;
