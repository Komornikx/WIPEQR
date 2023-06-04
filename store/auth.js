import { defineStore } from 'pinia';

const useAuthStore = defineStore('auth', {
	state: () => ({
		user: {
			_id: JSON.parse(localStorage.getItem('user'))?._id,
			login: JSON.parse(localStorage.getItem('user'))?.login,
			type: JSON.parse(localStorage.getItem('user'))?.type,
		},
		token: localStorage.getItem('token'),
	}),

	getters: {
		isLoggedIn: (state) => state.user && state.token,
	},

	actions: {
		async login(user, redirect) {
			this.error = null;
			try {
				const req = await $fetch(
					`${useRuntimeConfig().public.apiURL}/api/login`,
					{
						method: 'POST',
						body: user,
						headers: {
							authorization: localStorage.getItem('token'),
						},
					}
				);

				this.user = req.user;
				this.token = `Bearer ${req.token}`;
				this.loggedIn = true;

				if (!this.user || !this.token) {
					throw new Error('Unknown error while logging in');
				}
			} catch (err) {
				console.log(err);
				throw err;
			}

			localStorage.setItem('token', this.token);
			localStorage.setItem('user', JSON.stringify(this.user));

			navigateTo(redirect);
		},

		async logout() {
			this.resetData();
			//todo maybe send a request to disable token or something like that
		},

		async me() {
			try {
				const user = await $fetch(
					`${useRuntimeConfig().public.apiURL}/api/me`,
					{
						headers: {
							authorization: this.token,
						},
					}
				);

				this.user = user;
				this.loggedIn = true;

				localStorage.setItem('user', JSON.stringify(this.user));
			} catch (err) {
				this.resetData();
				navigateTo('/login');
			}
		},

		resetData() {
			this.loggedIn = false;
			this.user = {
				_id: null,
				login: null,
				type: null,
			};
			this.token = null;

			localStorage.removeItem('token');
			localStorage.removeItem('user');
		},
	},
});

export default useAuthStore;
