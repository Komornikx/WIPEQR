<template>
	<NuxtLayout>
		<NuxtPage class="tw-p-2" />
	</NuxtLayout>
</template>

<script>
import { mapStores, mapActions } from 'pinia';
import useAuthStore from '~/store/auth';

export default {
	beforeMount() {},

	computed: {
		...mapStores(useAuthStore),
	},

	methods: {
		// ...mapActions(useAuthStore)
	},
};
</script>
