import useAuthStore from '~/store/auth';

export default defineNuxtRouteMiddleware((to, from) => {
	const auth = useAuthStore();
	console.log(auth.user.type);
	if (auth.user.type !== 'admin') {
		return navigateTo('/test');
	}
});
