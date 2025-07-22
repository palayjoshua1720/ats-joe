<template>
	<div>
		<div class="text-center py-20" v-if="route.name === 'resources'">
			<h2 class="text-4xl font-light text-gray-500">Oops! This page is under construction.</h2>
			<p class="text-gray-400 mt-2">Please check back later!</p>
		</div>
		<router-view />
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script> 