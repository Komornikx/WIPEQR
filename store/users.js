import { defineStore } from 'pinia';

const useUsersStore = defineStore('users', {
	state: () => ({
		users: [],
		usersPristine: [],
		usersToRemove: [],

		fetching: false,
	}),

	actions: {
		async fetchUsers(query) {
			this.fetching = true;
			const data = await $fetch(
				`${useRuntimeConfig().public.apiURL}/api/users?${new URLSearchParams(
					query
				).toString()}`,
				{
					headers: {
						authorization: localStorage.getItem('token'),
					},
				}
			);
			this.users = data;

			if (this.users.length > 0) {
				this.usersPristine = JSON.parse(JSON.stringify(this.users));
			}

			this.fetching = false;
		},

		addUser() {
			this.users.push({
				firstName: '',
				lastName: '',
				login: '',
				password: '',
				nick: '',
				edit: true,
				type: 'normal',
			});

			console.log(this.users);
		},

		removeUser(i) {
			if (this.users[i]._id) {
				this.usersToRemove.push(this.users[i]._id);
			}
			this.users.splice(i, 1);
		},

		editUser(i) {
			this.users[i].edit = !this.users[i].edit;
		},

		rejectChanges() {
			this.users = JSON.parse(JSON.stringify(this.usersPristine));
		},
	},
});

export default useUsersStore;
