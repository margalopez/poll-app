
<template>
	<div class="poll-app">
		<RouterView />
	</div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<style scoped lang="scss">
.container {
	@apply p-8;

	h1 {
		@apply text-3xl font-bold text-blue-600 mb-4;
	}
}
</style>
