<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()

const isLoggedIn = ref(!!localStorage.getItem('token'))
const isAdmin = ref(localStorage.getItem('role') === 'admin')

// Re-check on every route change
watch(route, () => {
  isLoggedIn.value = !!localStorage.getItem('token')
  isAdmin.value = localStorage.getItem('role') === 'admin'
})

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  isLoggedIn.value = false
  isAdmin.value = false
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <router-link to="/" class="nav-brand">
      <span class="brand-icon">📚</span>
      <span class="brand-name">{{ isAdmin ? 'BookHub Admin' : 'BookHub' }}</span>
    </router-link>

    <div class="nav-links">
      <!-- Non connecté -->
      <template v-if="!isLoggedIn">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/login" class="nav-link">Login</router-link>
      </template>

      <!-- Utilisateur connecté -->
      <template v-else-if="!isAdmin">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/books" class="nav-link">All Books</router-link>
        <router-link to="/add" class="nav-link">Add Book</router-link>
        <router-link to="/favourites" class="nav-link">Favourites</router-link>
        <router-link to="/my-requests" class="nav-link">My Requests</router-link>
        <button class="nav-link nav-logout" @click="logout">Logout</button>
      </template>

      <!-- Admin connecté -->
      <template v-else>
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/admin/books" class="nav-link">Books</router-link>
        <router-link to="/admin/authors" class="nav-link">Authors</router-link>
        <router-link to="/admin/users" class="nav-link">Users</router-link>
        <router-link to="/admin/requests" class="nav-link">Requests</router-link>
        <button class="nav-link nav-logout" @click="logout">Logout</button>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
  height: 68px;
  background: #3b2a1a;
  box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.brand-icon { font-size: 1.5rem; }

.brand-name {
  font-family: 'Georgia', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #f5e6c8;
  letter-spacing: 0.5px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.nav-link {
  color: #d4b896;
  text-decoration: none;
  font-family: 'Georgia', serif;
  font-size: 0.95rem;
  padding: 0.45rem 1rem;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.nav-link:hover {
  background: #5a3e28;
  color: #f5e6c8;
}

.router-link-active {
  background: #5a3e28;
  color: #f5e6c8 !important;
}

.nav-logout {
  color: #e07b6a;
  font-family: 'Georgia', serif;
  font-size: 0.95rem;
}

.nav-logout:hover {
  background: #5a2a20;
  color: #f5c4ba;
}
</style>