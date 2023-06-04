<template>
	<td v-if="!user.edit">{{ user.firstName }}</td>
	<td v-else>
		<v-text-field
			name="login"
			label="Imię"
			id="login"
			variant="underlined"
			v-model="user.firstName"
		></v-text-field>
	</td>
	<td v-if="!user.edit">{{ user.lastName }}</td>
	<td v-else>
		<v-text-field
			name="login"
			label="Login"
			id="Nazwisko"
			variant="underlined"
			v-model="user.lastName"
		></v-text-field>
	</td>
	<td v-if="!user.edit">{{ user.login }}</td>
	<td v-else>
		<v-text-field
			name="login"
			label="Login"
			id="login"
			variant="underlined"
			v-model="user.login"
		></v-text-field>
	</td>
	<td v-if="!user.edit">*********</td>
	<td v-else>
		<v-text-field
			name="password"
			label="Hasło"
			id="password"
			variant="underlined"
			v-model="user.password"
		></v-text-field>
		{{ user.password }}
	</td>
	<td v-if="!user.edit">
		{{ user.type }}
	</td>
	<td v-else>
		<v-select
			:items="['normal', 'admin']"
			v-model="user.type"
			label="Typ"
			variant="underlined"
		></v-select>
	</td>
	<td v-if="!user.edit">
		<v-btn
			variant="text"
			color="blue"
			@click="$emit('edit')"
			size="small"
			icon
		>
			<v-icon>mdi-pen</v-icon>
		</v-btn>
		<v-btn
			variant="text"
			color="red"
			@click="$emit('remove')"
			size="small"
			icon
		>
			<v-icon>mdi-delete</v-icon>
		</v-btn>
	</td>
	<td v-else>
		<v-btn
			variant="text"
			color="green"
			@click="$emit('edit')"
			size="small"
			icon
		>
			<v-icon>mdi-check</v-icon>
		</v-btn>
		<v-btn
			variant="text"
			color="red"
			@click="$emit('remove')"
			size="small"
			icon
		>
			<v-icon>mdi-delete</v-icon>
		</v-btn>
	</td>
</template>

<script>
export default {
	emits: ['remove', 'edit'],
	props: {
		user: Object,
		edit: Boolean,
	},
};
</script>
