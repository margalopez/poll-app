<template>
    <div class="vote-view">

        <div v-if="loading" class="vote-container">
            <p class="state-msg">Loading poll…</p>
        </div>

        <div v-else-if="error" class="vote-container">
            <p class="state-msg error-msg">{{ error }}</p>
        </div>

        <div v-else-if="poll" class="vote-container">
            <h1>{{ poll.question }}</h1>

            <div class="options">
                <button
                    v-for="option in liveOptions"
                    :key="option.id"
                    class="option-btn"
                    :class="{
                        'option-btn--selected': votedOptionId === option.id,
                        'option-btn--dimmed': votedOptionId !== null && votedOptionId !== option.id,
                    }"
                    :disabled="votedOptionId !== null"
                    @click="vote(option.id)"
                >
                    {{ option.label }}
                </button>
            </div>

            <VoteChart :options="liveOptions" />
        </div>

    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

// types
import type { Poll, Option } from '@/@types/db'

// api
import { fetchPoll, castVote, subscribeToPollEvents } from '@/core/api'

// components
import VoteChart from '@/components/vote/VoteChart.vue'

const route = useRoute()
const id = Number(route.params['id'])

const poll = ref<Poll | null>(null)
const liveOptions = ref<Option[]>([])
const votedOptionId = ref<number | null>(null)
const loading = ref(true)
const error = ref('')

let eventSource: EventSource | null = null

onMounted(async () => {
    try {
        poll.value = await fetchPoll(id)
        liveOptions.value = poll.value.options
        eventSource = subscribeToPollEvents(id, (options) => {
            liveOptions.value = options
        })
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load poll.'
    } finally {
        loading.value = false
    }
})

onUnmounted(() => {
    eventSource?.close()
})

async function vote(optionId: number) {
    if (votedOptionId.value !== null) return
    votedOptionId.value = optionId
    try {
        await castVote(optionId)
    } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to cast vote.'
        votedOptionId.value = null
    }
}
</script>

<style scoped lang="scss">
.vote-view {
    @apply min-h-screen flex items-center justify-center p-6;
}

.vote-container {
    @apply flex flex-col gap-6 w-full max-w-lg;

    h1 {
        @apply text-3xl;
    }
}

.state-msg {
    @apply text-gray-500;

    &.error-msg {
        @apply text-red-500;
    }
}

.options {
    @apply flex flex-col gap-3;
}

.option-btn {
    @apply w-full px-4 py-3 rounded-lg border border-gray-200 text-left cursor-pointer
           transition-colors duration-150
           hover:border-black
           disabled:cursor-not-allowed;

    &--selected {
        @apply bg-black text-white border-black;
    }

    &--dimmed {
        @apply text-gray-400 border-gray-100;
    }
}
</style>
