import { defineStore } from 'pinia';

const usePlayersStore = defineStore('players', {
	state: () => ({
		players: [],
		playersPristine: [],
		playersToRemove: [],

		fetching: false,
	}),

	getters: {
		getPlayersByCategory: (state) => {
			return (category) =>
				state.players.filter((el) => el.category === category);
		},

		getPlayersPristineByCategory: (state) => {
			return (category) =>
				state.playersPristine.filter((el) => el.category === category);
		},
	},

	actions: {
		async fetchPlayers(query) {
			this.fetching = true;
			const data = await $fetch(
				`${useRuntimeConfig().public.apiURL}/api/players?${new URLSearchParams(
					query
				).toString()}`,
				{
					headers: {
						authorization: localStorage.getItem('token'),
					},
				}
			);
			this.players = data;

			this.playersPristine = JSON.parse(JSON.stringify(this.players));

			this.fetching = false;
		},

		removePlayer(player) {
			if (this.players.filter((el) => el === player)[0]._id) {
				this.playersToRemove.push(
					this.players.filter((el) => el === player)[0]._id
				);
			}
			this.players = this.players.filter((el) => el !== player);
		},

		editPlayer(player) {
			this.players.filter((el) => el === player)[0].edit = !this.players.filter(
				(el) => el === player
			)[0].edit;
		},

		rejectChanges() {
			this.players = JSON.parse(JSON.stringify(this.playersPristine));
		},
	},
});

export default usePlayersStore;
