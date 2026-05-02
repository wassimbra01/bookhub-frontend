<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api.js'

const books = ref([])
const favourites = ref(JSON.parse(localStorage.getItem('favourites') || '[]'))
const filterStartYear = ref(1800)
const filterEndYear = ref(2026)
const searchQuery = ref('')
const activeStart = ref(null)
const activeEnd = ref(null)
const activeSearch = ref('')
const loading = ref(true)
const selectedBook = ref(null)
const showModal = ref(false)
const requestSuccess = ref('')
const requestError = ref('')
const requestLoading = ref(false)

// Get logged in user id from token
function getUserId() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub
  } catch { return null }
}

onMounted(async () => {
  try {
    const res = await api.get('/books/all')
    books.value = res.data.listeBooks || res.data.data || res.data.books || res.data || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const filteredBooks = computed(() => {
  return books.value.filter(b => {
    if (activeStart.value && b.year < activeStart.value) return false
    if (activeEnd.value && b.year > activeEnd.value) return false
    if (activeSearch.value) {
      const q = activeSearch.value.toLowerCase()
      const titleMatch = b.title?.toLowerCase().includes(q)
      const authorMatch = authorName(b).toLowerCase().includes(q)
      if (!titleMatch && !authorMatch) return false
    }
    return true
  })
})

function applyFilter() {
  activeStart.value = filterStartYear.value || null
  activeEnd.value = filterEndYear.value || null
  activeSearch.value = searchQuery.value || ''
}

function resetFilter() {
  filterStartYear.value = 1800
  filterEndYear.value = 2026
  searchQuery.value = ''
  activeStart.value = null
  activeEnd.value = null
  activeSearch.value = ''
}

function isFavourite(id) {
  return favourites.value.some(f => f.id === id)
}

function toggleFavourite(book) {
  if (isFavourite(book.id)) {
    favourites.value = favourites.value.filter(f => f.id !== book.id)
  } else {
    favourites.value.push(book)
  }
  localStorage.setItem('favourites', JSON.stringify(favourites.value))
}

function authorName(book) {
  if (!book.author) return ''
  return book.author.prenom + ' ' + book.author.nom
}

function openBook(book) {
  selectedBook.value = book
  showModal.value = true
  requestSuccess.value = ''
  requestError.value = ''
}

async function sendRequest(type) {
  requestError.value = ''
  requestSuccess.value = ''
  requestLoading.value = true
  const userId = getUserId()
  if (!userId) {
    requestError.value = 'You must be logged in to make a request.'
    requestLoading.value = false
    return
  }
  try {
    await api.post('/requests', {
      type,
      bookId: selectedBook.value.id,
      userId,
      message: ''
    })
    requestSuccess.value = type === 'borrow'
      ? '📚 Borrow request sent! The admin will review it.'
      : '🛒 Purchase request sent! The admin will review it.'
  } catch (e) {
    requestError.value = 'Failed to send request. Please try again.'
  } finally {
    requestLoading.value = false
  }
}
</script>

<template>
  <div class="books-page">

    <!-- PAGE HEADER -->
    <div class="books-header">
      <div>
        <h1 class="books-title">📚 Book Catalogue</h1>
        <p class="books-sub">{{ filteredBooks.length }} book{{ filteredBooks.length !== 1 ? 's' : '' }} found</p>
      </div>
    </div>

    <!-- FILTER BAR -->
    <div class="filter-bar">
      <div class="filter-group search-group">
        <label>Search</label>
        <input v-model="searchQuery" placeholder="Title or author..." @keyup.enter="applyFilter"/>
      </div>
      <div class="filter-group">
        <label>From year</label>
        <input v-model.number="filterStartYear" type="number" placeholder="1800" />
      </div>
      <div class="filter-group">
        <label>To year</label>
        <input v-model.number="filterEndYear" type="number" placeholder="2026" />
      </div>
      <button class="btn btn-primary" @click="applyFilter">Search</button>
      <button class="btn btn-reset" @click="resetFilter">Reset</button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading-state">
      <span class="loading-icon">⏳</span>
      <p>Loading books...</p>
    </div>

    <!-- EMPTY -->
    <div v-else-if="filteredBooks.length === 0" class="empty-state">
      <span>📭</span>
      <p>No books found.</p>
      <button class="btn btn-primary" @click="resetFilter">Show all books</button>
    </div>

    <!-- BOOKS GRID -->
    <div v-else class="books-grid">
      <div class="book-card" v-for="book in filteredBooks" :key="book.id" @click="openBook(book)">
        <div class="book-cover-wrap">
          <img v-if="book.image" :src="book.image" :alt="book.title" class="book-cover"/>
          <div v-else class="book-cover-placeholder">📖</div>
          <button
            class="fav-btn"
            :class="{ active: isFavourite(book.id) }"
            @click.stop="toggleFavourite(book)"
            :title="isFavourite(book.id) ? 'Remove from favourites' : 'Add to favourites'"
          >
            {{ isFavourite(book.id) ? '❤️' : '🤍' }}
          </button>
        </div>
        <div class="book-info">
          <p class="book-year">{{ book.year }}</p>
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author" v-if="authorName(book)">by {{ authorName(book) }}</p>
          <p class="book-editor" v-if="book.editor">{{ book.editor }}</p>
        </div>
      </div>
    </div>

    <!-- BOOK DETAIL MODAL -->
    <div v-if="showModal && selectedBook" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <button class="modal-close" @click="showModal = false">✕</button>

        <div class="modal-body">
          <!-- COVER -->
          <div class="modal-cover-wrap">
            <img v-if="selectedBook.image" :src="selectedBook.image" :alt="selectedBook.title" class="modal-cover"/>
            <div v-else class="modal-cover-placeholder">📖</div>
          </div>

          <!-- DETAILS -->
          <div class="modal-details">
            <p class="modal-year">{{ selectedBook.year }}</p>
            <h2 class="modal-title">{{ selectedBook.title }}</h2>
            <p class="modal-author" v-if="authorName(selectedBook)">by {{ authorName(selectedBook) }}</p>

            <div class="modal-meta">
              <div class="meta-row" v-if="selectedBook.editor">
                <span class="meta-label">Publisher</span>
                <span class="meta-value">{{ selectedBook.editor }}</span>
              </div>
              <div class="meta-row" v-if="authorName(selectedBook)">
                <span class="meta-label">Author</span>
                <span class="meta-value">{{ authorName(selectedBook) }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Year</span>
                <span class="meta-value">{{ selectedBook.year }}</span>
              </div>
            </div>

            <!-- FAV BUTTON -->
            <button
              class="btn-fav"
              :class="{ 'btn-fav-active': isFavourite(selectedBook.id) }"
              @click="toggleFavourite(selectedBook)"
            >
              {{ isFavourite(selectedBook.id) ? '❤️ Remove from Favourites' : '🤍 Add to Favourites' }}
            </button>

            <!-- REQUEST SECTION -->
            <div class="request-section">
              <p class="request-label">📬 Interested in this book?</p>
              <div class="request-btns">
                <button class="btn-borrow" @click="sendRequest('borrow')" :disabled="requestLoading">
                  📚 Borrow
                </button>
                <button class="btn-buy" @click="sendRequest('buy')" :disabled="requestLoading">
                  🛒 Buy
                </button>
              </div>
              <p v-if="requestSuccess" class="request-success">{{ requestSuccess }}</p>
              <p v-if="requestError" class="request-error">{{ requestError }}</p>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.books-page { min-height: 100vh; background: #faf5ee; padding: 2.5rem 3rem; }
.books-header { margin-bottom: 2rem; }
.books-title { font-family: 'Georgia', serif; font-size: 2rem; color: #3b2a1a; margin-bottom: 0.2rem; }
.books-sub { color: #8a6a4a; font-size: 0.92rem; }

.filter-bar { display: flex; align-items: flex-end; gap: 1rem; background: #fff; padding: 1.2rem 1.5rem; border-radius: 12px; box-shadow: 0 2px 12px rgba(59,42,26,0.08); margin-bottom: 2.5rem; flex-wrap: wrap; }
.filter-group { display: flex; flex-direction: column; gap: 0.3rem; }
.search-group { flex: 1; min-width: 200px; }
.filter-group label { font-size: 0.8rem; font-weight: 600; color: #5a3e28; text-transform: uppercase; letter-spacing: 0.5px; }
.filter-group input { padding: 0.55rem 0.9rem; border: 1.5px solid #e0d0b8; border-radius: 7px; font-size: 0.92rem; font-family: inherit; color: #3b2a1a; background: #fffdf9; outline: none; width: 100%; transition: border-color 0.2s; }
.filter-group input:focus { border-color: #d4a96a; }

.btn { padding: 0.6rem 1.4rem; border-radius: 8px; border: none; font-family: 'Georgia', serif; font-size: 0.92rem; cursor: pointer; transition: all 0.2s; align-self: flex-end; }
.btn-primary { background: #d4a96a; color: #3b2a1a; font-weight: 700; }
.btn-primary:hover { background: #c49058; transform: translateY(-1px); }
.btn-reset { background: #e8d8c0; color: #5a3e28; }
.btn-reset:hover { background: #dcc8a8; }

.loading-state, .empty-state { text-align: center; padding: 5rem 2rem; color: #8a6a4a; }
.loading-icon { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
.empty-state span { font-size: 3rem; display: block; margin-bottom: 1rem; }
.empty-state p { margin-bottom: 1.5rem; font-size: 1rem; }

.books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.8rem; }
.book-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 16px rgba(59,42,26,0.09); transition: transform 0.22s, box-shadow 0.22s; display: flex; flex-direction: column; cursor: pointer; }
.book-card:hover { transform: translateY(-5px); box-shadow: 0 8px 28px rgba(59,42,26,0.16); }

.book-cover-wrap { position: relative; height: 230px; overflow: hidden; background: #e8d8c0; }
.book-cover { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.book-card:hover .book-cover { transform: scale(1.04); }
.book-cover-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; background: linear-gradient(135deg, #e8d8c0, #d4b896); }

.fav-btn { position: absolute; top: 0.6rem; right: 0.6rem; width: 34px; height: 34px; border-radius: 50%; border: none; background: rgba(255,255,255,0.9); font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: transform 0.2s; opacity: 0; }
.book-card:hover .fav-btn { opacity: 1; }
.fav-btn.active { opacity: 1; }
.fav-btn:hover { transform: scale(1.15); }

.book-info { padding: 1rem; flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }
.book-year { font-size: 0.75rem; color: #d4a96a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.book-title { font-family: 'Georgia', serif; font-weight: 700; font-size: 0.97rem; color: #3b2a1a; line-height: 1.3; }
.book-author { font-size: 0.82rem; color: #8a6a4a; font-style: italic; }
.book-editor { font-size: 0.78rem; color: #b09070; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(42,29,16,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 1rem; }
.modal { background: #fff; border-radius: 20px; width: 100%; max-width: 640px; box-shadow: 0 24px 64px rgba(0,0,0,0.3); position: relative; overflow: hidden; max-height: 90vh; overflow-y: auto; }
.modal-close { position: absolute; top: 1rem; right: 1rem; width: 32px; height: 32px; border-radius: 50%; border: none; background: rgba(0,0,0,0.08); font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 1; transition: background 0.2s; }
.modal-close:hover { background: rgba(0,0,0,0.15); }

.modal-body { display: flex; }
.modal-cover-wrap { width: 200px; flex-shrink: 0; min-height: 320px; background: #e8d8c0; }
.modal-cover { width: 100%; height: 100%; object-fit: cover; }
.modal-cover-placeholder { width: 100%; height: 100%; min-height: 320px; display: flex; align-items: center; justify-content: center; font-size: 4rem; background: linear-gradient(135deg, #e8d8c0, #d4b896); }

.modal-details { padding: 1.8rem; flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
.modal-year { font-size: 0.78rem; color: #d4a96a; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.modal-title { font-family: 'Georgia', serif; font-size: 1.4rem; font-weight: 700; color: #3b2a1a; line-height: 1.3; margin-bottom: 0.2rem; }
.modal-author { font-size: 0.95rem; color: #8a6a4a; font-style: italic; margin-bottom: 0.5rem; }

.modal-meta { background: #faf5ee; border-radius: 10px; overflow: hidden; margin: 0.5rem 0; }
.meta-row { display: flex; justify-content: space-between; padding: 0.6rem 1rem; border-bottom: 1px solid #ede4d6; }
.meta-row:last-child { border-bottom: none; }
.meta-label { font-size: 0.78rem; color: #8a6a4a; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
.meta-value { font-size: 0.88rem; color: #3b2a1a; font-weight: 500; }

.btn-fav { padding: 0.65rem 1.4rem; border-radius: 8px; border: none; font-family: 'Georgia', serif; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; width: 100%; font-weight: 600; background: #f5ede0; color: #5a3e28; margin-top: 0.5rem; }
.btn-fav:hover { background: #ead5b0; }
.btn-fav-active { background: #fde8e8; color: #922b21; }
.btn-fav-active:hover { background: #fbd0d0; }

/* REQUEST SECTION */
.request-section {
  margin-top: 0.8rem;
  padding: 1rem;
  background: #faf5ee;
  border-radius: 10px;
  border: 1px dashed #d4a96a;
}
.request-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #5a3e28;
  margin-bottom: 0.7rem;
}
.request-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}
.btn-borrow {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1.5px solid #4a80c0;
  background: #f0f5ff;
  color: #2050a0;
  font-family: 'Georgia', serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-borrow:hover { background: #dce8ff; transform: translateY(-1px); }
.btn-borrow:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-buy {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1.5px solid #d4a96a;
  background: #fff8ee;
  color: #8a5020;
  font-family: 'Georgia', serif;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-buy:hover { background: #ffeedd; transform: translateY(-1px); }
.btn-buy:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.request-success {
  margin-top: 0.7rem;
  font-size: 0.83rem;
  color: #208040;
  background: #e8faf0;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #a0d0b0;
}
.request-error {
  margin-top: 0.7rem;
  font-size: 0.83rem;
  color: #922b21;
  background: #fdf0ef;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  border: 1px solid #e8a9a3;
}
</style>