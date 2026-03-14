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

            <p>Live Results</p>
            
            <VoteChart :options="liveOptions" />

            <p>Please vote in the following link:</p>

            <div class="share-row">
                <span class="share-url">{{ voteUrl(poll.id) }}</span>

                <button
                    class="btn-icon"
                    :aria-label="copied ? 'Copied!' : 'Copy link'"
                    :title="copied ? 'Copied!' : 'Copy link'"
                    @click="copyLink(poll!.id)"
                >
                    <i v-if="!copied" class="i-poll-copy" />
                    <i v-else class="i-poll-check" />
                </button>

                <a
                    class="btn-icon"
                    :href="voteUrl(poll.id)"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open in new tab"
                    title="Open in new tab"
                >
                    <i class="i-poll-external-link" />
                </a>
            </div>
            
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

// types
import type { Poll, Option } from '@/@types/db'

// api
import { fetchPoll, subscribeToPollEvents } from '@/core/api'

// components
import VoteChart from '@/components/vote/VoteChart.vue'

const route = useRoute()
const id = Number(route.params['id'])

const poll = ref<Poll | null>(null)
const liveOptions = ref<Option[]>([])
const loading = ref(true)
const error = ref('')

let eventSource: EventSource | null = null

/**
 * Results & vis data.
 */

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

/**
 * Share link.
 */

const copied = ref(false)

function voteUrl(id: number): string {
    return `${window.location.origin}/vote/${id}`
}

async function copyLink(id: number) {
    await navigator.clipboard.writeText(voteUrl(id))
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
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

.share-row {
    @apply flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200;
}

.share-url {
    @apply flex-1 text-sm text-gray-700 break-all;
}

.btn-icon {
    @apply flex items-center justify-center w-9 h-9 rounded-full shrink-0
           text-gray-500 cursor-pointer transition-colors duration-150
           hover:bg-gray-200 hover:text-black;
}
</style>
