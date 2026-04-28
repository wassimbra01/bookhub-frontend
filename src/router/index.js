import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AllBooksView from '../views/AllBooksView.vue'
import AddBookView from '../views/AddBookView.vue'
import FavouritesView from '../views/FavouritesView.vue'
import AdminBooksView from '../views/AdminBooksView.vue'
import AdminAuthorsView from '../views/AdminAuthorsView.vue'
import AdminUsersView from '../views/AdminUsersView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/books', component: AllBooksView, meta: { requiresAuth: true } },
  { path: '/add', component: AddBookView, meta: { requiresAuth: true } },
  { path: '/favourites', component: FavouritesView, meta: { requiresAuth: true } },
  { path: '/admin/books', component: AdminBooksView, meta: { requiresAdmin: true } },
  { path: '/admin/authors', component: AdminAuthorsView, meta: { requiresAdmin: true } },
  { path: '/admin/users', component: AdminUsersView, meta: { requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  if (to.meta.requiresAuth && !token) return next('/login')
  if (to.meta.requiresAdmin && role !== 'admin') return next('/')
  next()
})

export default router