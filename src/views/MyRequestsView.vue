<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api.js'

const requests = ref([])
const loading = ref(true)
const filter = ref('all')

function getUserId() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub
  } catch { return null }
}

onMounted(async () => {
  const userId = getUserId()
  if (!userId) return
  try {
    const res = await api.get(`/requests/user/${userId}`)
    requests.value = Array.isArray(res.data) ? res.data : []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const filteredRequests = computed(() => {
  if (filter.value === 'all') return requests.value
  return requests.value.filter(r => r.status === filter.value)
})

const pendingCount = computed(() => requests.value.filter(r => r.status === 'pending').length)
const approvedCount = computed(() => requests.value.filter(r => r.status === 'approved').length)

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

function statusLabel(status) {
  if (status === 'pending') return '⏳ Pending'
  if (status === 'approved') return '✅ Approved'
  return '❌ Rejected'
}
</script>

<template>
  <div class="requests-page">

    <!-- HEADER -->
    <div class="page-header">
      <div>
        <h1 class="page-title">📬 My Requests</h1>
        <p class="page-sub">Track your borrow and purchase requests</p>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-icon">📋</span>
        <div>
          <p class="stat-value">{{ requests.length }}</p>
          <p class="stat-label">Total</p>
        </div>
      </div>
      <div class="stat-card pending">
        <span class="stat-icon">⏳</span>
        <div>
          <p class="stat-value">{{ pendingCount }}</p>
          <p class="stat-label">Pending</p>
        </div>
      </div>
      <div class="stat-card approved">
        <span class="stat-icon">✅</span>
        <div>
          <p class="stat-value">{{ approvedCount }}</p>
          <p class="stat-label">Approved</p>
        </div>
      </div>
    </div>

    <!-- FILTER TABS -->
    <div class="filter-tabs">
      <button class="filter-tab" :class="{ active: filter === 'all' }" @click="filter = 'all'">All</button>
      <button class="filter-tab" :class="{ active: filter === 'pending' }" @click="filter = 'pending'">⏳ Pending</button>
      <button class="filter-tab" :class="{ active: filter === 'approved' }" @click="filter = 'approved'">✅ Approved</button>
      <button class="filter-tab" :class="{ active: filter === 'rejected' }" @click="filter = 'rejected'">❌ Rejected</button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="empty-state">
      <span>⏳</span>
      <p>Loading your requests...</p>
    </div>

    <!-- EMPTY -->
    <div v-else-if="filteredRequests.length === 0" class="empty-state">
      <span>📭</span>
      <p v-if="filter === 'all'">You haven't made any requests yet.</p>
      <p v-else>No {{ filter }} requests.</p>
      <router-link to="/books" class="btn-browse">Browse Books →</router-link>
    </div>

    <!-- REQUESTS LIST -->
    <div v-else class="requests-list">
      <div class="request-card" v-for="req in filteredRequests" :key="req.id">

        <!-- BOOK COVER -->
        <div class="req-cover-wrap">
          <img v-if="req.book?.image" :src="req.book.image" :alt="req.book?.title" class="req-cover"/>
          <div v-else class="req-cover-placeholder">📖</div>
        </div>

        <!-- BOOK INFO -->
        <div class="req-info">
          <h3 class="req-book-title">{{ req.book?.title || 'Unknown Book' }}</h3>
          <p class="req-author" v-if="req.book?.author">
            by {{ req.book.author.prenom }} {{ req.book.author.nom }}
          </p>
          <p class="req-editor" v-if="req.book?.editor">{{ req.book.editor }} · {{ req.book?.year }}</p>
        </div>

        <!-- REQUEST DETAILS -->
        <div class="req-details">
          <span class="type-badge" :class="req.type">
            {{ req.type === 'borrow' ? '📚 Borrow' : '🛒 Buy' }}
          </span>
          <p class="req-date">{{ formatDate(req.createdAt) }}</p>
        </div>

        <!-- STATUS -->
        <div class="req-status">
          <span class="status-badge" :class="req.status">
            {{ statusLabel(req.status) }}
          </span>
          <p v-if="req.status === 'approved'" class="status-note approved-note">
            🎉 Your request was approved! Contact us to proceed.
          </p>
          <p v-if="req.status === 'rejected'" class="status-note rejected-note">
            This request was not approved.
          </p>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
.requests-page {
  min-height: 100vh;
  background: #faf5ee;
  padding: 2.5rem 3rem;
}

.page-header { margin-bottom: 2rem; }
.page-title { font-family: 'Georgia', serif; font-size: 2rem; color: #3b2a1a; margin-bottom: 0.2rem; }
.page-sub { color: #8a6a4a; font-size: 0.92rem; }

/* STATS */
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; margin-bottom: 2rem; }
.stat-card { background: #fff; border-radius: 12px; padding: 1.2rem 1.5rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 12px rgba(59,42,26,0.08); border-left: 4px solid #d4a96a; }
.stat-card.pending { border-left-color: #f0a030; }
.stat-card.approved { border-left-color: #40a060; }
.stat-icon { font-size: 1.6rem; }
.stat-value { font-family: 'Georgia', serif; font-size: 1.5rem; font-weight: 700; color: #3b2a1a; }
.stat-label { font-size: 0.78rem; color: #8a6a4a; text-transform: uppercase; letter-spacing: 0.5px; }

/* FILTER TABS */
.filter-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.8rem; flex-wrap: wrap; }
.filter-tab { padding: 0.45rem 1.1rem; border-radius: 20px; border: 1.5px solid #e0d0b8; background: #fff; color: #8a6a4a; font-size: 0.85rem; font-family: inherit; cursor: pointer; transition: all 0.2s; }
.filter-tab.active { background: #3b2a1a; color: #f5e6c8; border-color: #3b2a1a; }

/* EMPTY */
.empty-state { text-align: center; padding: 5rem 2rem; color: #8a6a4a; }
.empty-state span { font-size: 3rem; display: block; margin-bottom: 1rem; }
.empty-state p { font-size: 1rem; margin-bottom: 1.5rem; }
.btn-browse { display: inline-block; padding: 0.65rem 1.5rem; background: #d4a96a; color: #3b2a1a; border-radius: 8px; font-family: 'Georgia', serif; font-weight: 700; font-size: 0.95rem; text-decoration: none; transition: all 0.2s; }
.btn-browse:hover { background: #c49058; }

/* REQUESTS LIST */
.requests-list { display: flex; flex-direction: column; gap: 1rem; }

.request-card {
  background: #fff;
  border-radius: 14px;
  padding: 1.2rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 2px 12px rgba(59,42,26,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid transparent;
}
.request-card:hover { transform: translateX(3px); box-shadow: 0 4px 20px rgba(59,42,26,0.12); }

/* STATUS COLORS ON CARD */
.request-card:has(.status-badge.pending) { border-left-color: #f0a030; }
.request-card:has(.status-badge.approved) { border-left-color: #40a060; }
.request-card:has(.status-badge.rejected) { border-left-color: #c03020; }

/* COVER */
.req-cover-wrap { flex-shrink: 0; }
.req-cover { width: 55px; height: 75px; object-fit: cover; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }
.req-cover-placeholder { width: 55px; height: 75px; background: linear-gradient(135deg, #e8d8c0, #d4b896); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }

/* INFO */
.req-info { flex: 1; min-width: 0; }
.req-book-title { font-family: 'Georgia', serif; font-size: 1.05rem; font-weight: 700; color: #3b2a1a; margin-bottom: 0.2rem; }
.req-author { font-size: 0.85rem; color: #8a6a4a; font-style: italic; }
.req-editor { font-size: 0.78rem; color: #b09070; margin-top: 0.1rem; }

/* DETAILS */
.req-details { text-align: center; flex-shrink: 0; }
.req-date { font-size: 0.75rem; color: #b09070; margin-top: 0.4rem; }

/* STATUS */
.req-status { text-align: right; flex-shrink: 0; min-width: 140px; }
.status-note { font-size: 0.75rem; margin-top: 0.4rem; max-width: 140px; line-height: 1.3; }
.approved-note { color: #208040; }
.rejected-note { color: #922b21; }

/* BADGES */
.type-badge { display: inline-block; padding: 0.25rem 0.8rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
.type-badge.borrow { background: #e8f0ff; color: #2050a0; }
.type-badge.buy { background: #fff0e0; color: #a06020; }

.status-badge { display: inline-block; padding: 0.28rem 0.8rem; border-radius: 20px; font-size: 0.82rem; font-weight: 700; }
.status-badge.pending { background: #fff8e0; color: #a07000; }
.status-badge.approved { background: #e8faf0; color: #208040; }
.status-badge.rejected { background: #fdf0ef; color: #922b21; }
</style>