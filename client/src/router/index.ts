import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [{
        path: '/', component: () => import('../views/PollView.vue')
    }, {
        path: '/vote/:id', component: () => import('../views/VoteView.vue')
    }, {
        path: '/results/:id', component: () => import('../views/ResultsView.vue')
    }],
})

export default router
