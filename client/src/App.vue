<script setup lang="ts"></script>

<template>
<div class="container">
	<!-- UnoCSS (Tailwind) utility classes -->
	<h1>Title</h1>
	<p class="text-gray-500">Hot reload and scoped SCSS are working if this looks styled.</p>
</div>
</template>

<style scoped lang="scss">
.container {
	@apply p-8;

	h1 {
		@apply text-3xl font-bold text-blue-600 mb-4;
	}
}
</style>
