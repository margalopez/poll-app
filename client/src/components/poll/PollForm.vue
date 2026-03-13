<template>
    <form 
        class="poll-form"
        novalidate
        @submit.prevent="submit"
    >
        <h1>Create a Poll</h1>

        <div class="field">
            <label for="question">Question</label>
            <input
                id="question"
                v-model="question"
                type="text"
                placeholder="Ask something…"
                :class="{ error: errors.question }"
                @input="errors.question = ''"
            />
            <span v-if="errors.question" class="error-msg">{{ errors.question }}</span>
        </div>

        <div class="field">
            <label>Options</label>

            <div
                v-for="(_, i) in options"
                :key="i"
                class="option-row"
            >
                <input
                    v-model="options[i]"
                    type="text"
                    :placeholder="`Option ${i + 1}`"
                    :class="{ error: errors.options[i] }"
                    @input="errors.options[i] = ''"
                />
                <button
                    v-if="options.length > 2"
                    type="button"
                    class="btn-remove"
                    aria-label="Remove option"
                    @click="removeOption(i)"
                >
                    <i class="i-poll-times" />
                </button>
                <span v-if="errors.options[i]" class="error-msg option-error">{{ errors.options[i] }}</span>
            </div>

            <span v-if="errors.optionsCount" class="error-msg">{{ errors.optionsCount }}</span>

            <button
                v-if="options.length < 5"
                type="button"
                class="btn-add"
                @click="addOption"
            >
                + Add option
            </button>
        </div>

        <button
            type="submit"
            class="btn-submit"
            :disabled="submitting"
        >
            {{ submitting ? 'Creating…' : 'Create Poll' }}
        </button>
    </form>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { createPoll } from '@/core/api'
import type { Poll } from '@/@types/db'

const question = ref('')
const options = ref<string[]>(['', ''])
const errors = reactive({ question: '', options: [] as string[], optionsCount: '' })
const submitting = ref(false)
const createdPoll = ref<Poll | null>(null)

function addOption() {
    if (options.value.length < 5) options.value.push('')
}

function removeOption(index: number) {
    if (options.value.length > 2) {
        options.value.splice(index, 1)
        errors.options.splice(index, 1)
    }
}

function validate(): boolean {
    errors.question = question.value.trim() ? '' : 'Question is required.'
    errors.options = options.value.map(o => o.trim() ? '' : 'Option cannot be empty.')
    errors.optionsCount = (options.value.length >= 2 && options.value.length <= 5)
        ? ''
        : 'Include between 2 and 5 options.'
    return !errors.question && errors.options.every(e => !e) && !errors.optionsCount
}

const emit = defineEmits(['submitted'])

async function submit() {
    if (!validate()) return
    submitting.value = true
    try {
        createdPoll.value = await createPoll(
            question.value.trim(),
            options.value.map(o => o.trim()),
        )
    } finally {
        submitting.value = false
        emit('submitted', createdPoll.value)
    }
}

</script>

<style scoped lang="scss">

.poll-form {
    @apply flex flex-col gap-6 w-full max-w-lg;

    .field {
        @apply flex flex-col gap-2;

        label {
            @apply text-sm font-600 tracking-wide uppercase text-gray-500;
        }

        input {
            @apply w-full px-4 py-3 rounded-lg border border-solid border-gray-200 outline-none
                transition-colors duration-150
                focus:border-black;

            &.error {
                @apply border-red-400;
            }
        }
    }

    .error-msg {
        @apply text-sm text-red-500;
    }

    .option-row {
        @apply flex flex-wrap items-center gap-2;

        input {
            @apply flex-1;
        }

        .option-error {
            @apply w-full;
        }
    }

    .btn-remove {
        @apply flex items-center justify-center w-8 h-8 rounded-full
            text-gray-400 cursor-pointer transition-colors duration-150
            hover:bg-gray-100 hover:text-red-500;
    }

    .btn-add {
        @apply px-6 py-3 rounded-lg self-start text-sm font-600 text-gray-500 cursor-pointer
            transition-colors duration-150 hover:text-black;
    }

    .btn-submit {
        @apply px-6 py-3 rounded-lg bg-black text-white font-600 cursor-pointer
            transition-opacity duration-150
            disabled:opacity-40 disabled:cursor-not-allowed;
    }
}

</style>