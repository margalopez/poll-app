<template>
    <div class="poll-view">
        <PollForm @submitted="pollSubmitted" />
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

// types
import type { Poll } from '@/@types/db'

// components
import PollForm from '@/components/poll/PollForm.vue'

const router = useRouter()
function pollSubmitted (createdPoll: Poll) {
    router.push(`/results/${createdPoll.id}`)
}

</script>

<style scoped lang="scss">
.poll-view {
    @apply min-h-screen flex items-center justify-center p-6;
}

.poll-created {
    @apply flex flex-col gap-6 w-full max-w-lg;
}
</style>
