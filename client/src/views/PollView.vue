<template>
    <div class="poll-view">

        <PollForm
            v-if="!createdPoll"
            @submitted="createdPoll = $event"
        />

        <div v-else class="poll-created">
            <h1>Poll created!</h1>
            <p>Share this link so others can vote:</p>

            <div class="share-row">
                <span class="share-url">{{ voteUrl(createdPoll.id) }}</span>

                <button
                    class="btn-icon"
                    :aria-label="copied ? 'Copied!' : 'Copy link'"
                    :title="copied ? 'Copied!' : 'Copy link'"
                    @click="copyLink(createdPoll!.id)"
                >
                    <i v-if="!copied" class="i-poll-copy" />
                    <i v-else class="i-poll-check" />
                </button>

                <a
                    class="btn-icon"
                    :href="voteUrl(createdPoll.id)"
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
import { ref } from 'vue'

// types
import type { Poll } from '@/@types/db'

// components
import PollForm from '@/components/poll/PollForm.vue'

const createdPoll = ref<Poll | null>(null)
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
.poll-view {
    @apply min-h-screen flex items-center justify-center p-6;
}

.poll-created {
    @apply flex flex-col gap-6 w-full max-w-lg;
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
