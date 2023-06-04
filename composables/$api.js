// import useAuthStore from '~/store/auth';

//todo somehow prevent from adding authorization header for each $fetch and try to put that in some wrapper globally.
// export const $api = {
// 	get: async (URL, body, headers) => {
// 		return await $fetch(URL, {
// 			...headers,
// 			method: 'GET',
// 			authorization: useAuthStore().token,
// 			body,
// 		});
// 	},
// 	post: async (URL, body, headers) => {
// 		return await $fetch(URL, {
// 			...headers,
// 			method: 'POST',
// 			authorization: useAuthStore().token,
// 			body,
// 		});
// 	},
// 	put: async (URL, body, headers) => {
// 		return await $fetch(URL, {
// 			...headers,
// 			method: 'PUT',
// 			authorization: useAuthStore().token,
// 			body,
// 		});
// 	},
// 	delete: async (URL, body, headers) => {
// 		return await $fetch(URL, {
// 			...headers,
// 			method: 'DELETE',
// 			authorization: useAuthStore().token,
// 			body,
// 		});
// 	},
// };
