import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/', component: () => import('../views/HomeView.vue') },
  { path: '/locations', component: () => import('../views/LocationsView.vue') },
  {
    path: '/locations/:locationId',
    component: () => import('../views/LocationDetailView.vue')
  },
  { path: '/posts', component: () => import('../views/PostsView.vue') },
  {
    path: '/posts/new',
    component: () => import('../views/PostCreateView.vue')
  },
  {
    path: '/posts/:postId',
    component: () => import('../views/PostDetailView.vue')
  },
  {
    path: '/posts/:postId/edit',
    component: () => import('../views/PostEditView.vue')
  },
  {
    path: '/statistics',
    component: () => import('../views/StatisticsView.vue')
  },
  {
    path: '/data-source',
    component: () => import('../views/DataSourceView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFoundView.vue')
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
export default router
