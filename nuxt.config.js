const os = require('os');

export default defineNuxtConfig({
	ssr: false,
	app: {
		head: {
			charset: 'utf-16',
			viewport: 'width=500, initial-scale=1',
			title: 'WIPEQR',
			meta: [],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: './favicon.ico' },
				{
					rel: 'stylesheet',
					href: 'https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css',
				},
				{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				{ rel: 'preconnect', href: 'https://fonts.gstatic.com' },
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300&display=swap',
					rel: 'stylesheet',
				},
			],
		},
	},

	dirs: ['stores'],

	css: ['vuetify/lib/styles/main.sass'],
	build: {
		transpile: ['vuetify'],
	},
	vite: {
		define: {
			'process.env.DEBUG': false,
		},
	},

	modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},

	runtimeConfig: {
		public: {
			apiURL: `http://${process.env.DOMAIN || os.hostname()}:3010`,
		},
	},

	generate: {
		fallback: true,
	},
});
