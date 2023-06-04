import useAuthStore from '~/store/auth';
import useTicketsStore from '~/store/tickets';
import usePlayersStore from '~/store/players';
import useUsersStore from '~/store/users';

export default defineNuxtRouteMiddleware((to, from) => {
	const auth = useAuthStore();

	if (!auth.token && to.name != 'login') {
		return navigateTo({
			path: `/login`,
			query: {
				redirect: to.fullPath,
			},
		});
	} else if (auth.token && to.name == 'login') {
		return navigateTo('/');
	}

	if (to.name === 'login' && !auth.token) {
		useAuthStore().$reset();
		useTicketsStore().$reset();
		usePlayersStore().$reset();
		useUsersStore().$reset();
	}
});
