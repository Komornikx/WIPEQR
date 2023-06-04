<template>
	<td>{{ formatDate(presence.from) }}</td>
	<td>
		{{ formatDate(presence.to) || '-' }}
	</td>
</template>

<script>
import { format } from 'date-fns';

export default {
	data() {
		return {};
	},

	props: {
		presence: Object,
	},

	methods: {
		formatDate(date) {
			return date ? format(new Date(date), 'H:m:s dd.LL.y') : null;
		},
	},
};
</script>
