<template>
    <div class="vote-chart">
        <Bar
            :data="chartData"
            :options="chartOptions"
        />
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
} from 'chart.js'

// types
import type { Option } from '@/@types/db'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

const props = defineProps<{ options: Option[] }>()

const chartData = computed(() => ({
    labels: props.options.map(o => o.label),
    datasets: [{
        data: props.options.map(o => o.votes),
        backgroundColor: '#000000',
        borderRadius: 6,
        borderSkipped: false,
    }],
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    plugins: {
        legend: { display: false },
    },
    scales: {
        x: {
            grid: { display: false },
            border: { display: false },
            ticks: {
                font: { family: 'MozillaText, ui-sans-serif, sans-serif', size: 13, weight: '500' },
                color: '#374151',
            },
        },
        y: {
            beginAtZero: true,
            border: { display: false },
            ticks: {
                precision: 0,
                font: { family: 'MozillaText, ui-sans-serif, sans-serif', size: 12 },
                color: '#9ca3af',
            },
            grid: {
                color: '#f3f4f6',
            },
        },
    },
}
</script>

<style scoped lang="scss">
.vote-chart {
    @apply w-full h-56;
}
</style>
