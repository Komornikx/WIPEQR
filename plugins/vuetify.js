import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { VDataTable } from 'vuetify/labs/VDataTable';

export default defineNuxtPlugin((nuxtApp) => {
	const vuetify = createVuetify({
		icons: {
			defaultSet: 'mdi',
			aliases,
			sets: {
				mdi,
			},
		},
		components: {
			...components,
			VDataTable,
		},
		directives,
	});

	nuxtApp.vueApp.use(vuetify);
});
