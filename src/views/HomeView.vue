<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = !!localStorage.getItem('token')

const popularBooks = [
  {
    id: 1,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    image: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
    description: "A chilling vision of a totalitarian society where Big Brother watches your every move. A must-read classic that defined a generation."
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic Literature',
    image: 'https://covers.openlibrary.org/b/isbn/9780061743528-L.jpg',
    description: "A powerful story of racial injustice and moral growth in the American South."
  },
  {
    id: 3,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Philosophical Fiction',
    image: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg',
    description: "An inspiring journey of self-discovery and following your personal legend."
  },
  {
    id: 4,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Literary Fiction',
    image: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
    description: "A glittering tale of wealth, obsession and the elusive American Dream."
  },
]

function goToCatalogue() {
  if (isLoggedIn) router.push('/books')
  else router.push('/login')
}
</script>

<template>
  <!-- HERO -->
  <div class="hero">
    <div class="hero-content">
      <p class="hero-tag">📚 Your personal library</p>
      <h1 class="hero-title">Find your next<br/><span class="hero-accent">great read.</span></h1>
      <p class="hero-sub">From timeless classics to modern bestsellers — discover, save, and manage your book collection all in one place.</p>
      <button class="btn btn-primary" @click="goToCatalogue">Explore the Catalogue</button>
    </div>
    <div class="hero-decoration">
      <div class="hero-circle"></div>
    </div>
  </div>

  <!-- FEATURED BOOKS — MAGAZINE LAYOUT -->
  <div class="featured-section">
    <div class="featured-header">
      <div>
        <h2 class="featured-title">Featured Books</h2>
        <p class="featured-sub">Hand-picked titles our readers love the most</p>
      </div>
      <button class="btn-ghost" @click="goToCatalogue">View all books →</button>
    </div>

    <div class="magazine-layout">
      <!-- BIG FEATURED CARD (first book) -->
      <div class="big-card" @click="goToCatalogue">
        <div class="big-card-image-wrap">
          <img :src="popularBooks[0].image" :alt="popularBooks[0].title" class="big-card-img"/>
          <span class="genre-badge">{{ popularBooks[0].genre }}</span>
        </div>
        <div class="big-card-body">
          <p class="card-label">⭐ Editor's Pick</p>
          <h3 class="big-card-title">{{ popularBooks[0].title }}</h3>
          <p class="big-card-author">by {{ popularBooks[0].author }}</p>
          <p class="big-card-desc">{{ popularBooks[0].description }}</p>
          <button class="btn btn-primary btn-sm" @click.stop="goToCatalogue">Read more</button>
        </div>
      </div>

      <!-- SIDE STACK (books 2, 3, 4) -->
      <div class="side-stack">
        <div
          class="side-card"
          v-for="book in popularBooks.slice(1)"
          :key="book.id"
          @click="goToCatalogue"
        >
          <img :src="book.image" :alt="book.title" class="side-card-img"/>
          <div class="side-card-body">
            <span class="side-genre">{{ book.genre }}</span>
            <h4 class="side-card-title">{{ book.title }}</h4>
            <p class="side-card-author">by {{ book.author }}</p>
            <p class="side-card-desc">{{ book.description }}</p>
          </div>
          <span class="side-arrow">→</span>
        </div>
      </div>
    </div>
  </div>

  <!-- FEATURES SECTION -->
  <div class="features-section">
    <div class="feature-card">
      <span class="feature-icon">🔍</span>
      <h3>Browse Books</h3>
      <p>Explore our full catalogue and find books by title or author.</p>
    </div>
    <div class="feature-card">
      <span class="feature-icon">❤️</span>
      <h3>Save Favourites</h3>
      <p>Keep track of books you love in your personal favourites list.</p>
    </div>
    <div class="feature-card">
      <span class="feature-icon">✍️</span>
      <h3>Add Books</h3>
      <p>Contribute to the collection by adding new books and authors.</p>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="footer-brand">📚 BookHub</div>
    <p class="footer-text">A full-stack bookstore application built with Vue.js & NestJS</p>
    <p class="footer-authors">Developed by <strong>Wassim</strong> & <strong>Rayen</strong> — 2026</p>
  </footer>
</template>

<style scoped>
/* HERO */
.hero {
  background: linear-gradient(135deg, #3b2a1a 0%, #6b4c2e 100%);
  padding: 5rem 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  min-height: 420px;
}
.hero-content { max-width: 580px; z-index: 1; }
.hero-tag { color: #d4a96a; font-size: 0.95rem; font-family: 'Georgia', serif; letter-spacing: 1px; margin-bottom: 1rem; }
.hero-title { font-family: 'Georgia', serif; font-size: 3rem; font-weight: 700; color: #f5e6c8; line-height: 1.2; margin-bottom: 1.2rem; }
.hero-accent { color: #d4a96a; }
.hero-sub { color: #c4a882; font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem; max-width: 460px; }
.hero-decoration { position: absolute; right: -80px; top: -80px; }
.hero-circle { width: 420px; height: 420px; border-radius: 50%; background: rgba(255,255,255,0.04); border: 2px solid rgba(212,169,106,0.15); }

/* BUTTONS */
.btn { display: inline-block; padding: 0.7rem 1.8rem; border-radius: 8px; border: none; font-family: 'Georgia', serif; font-size: 1rem; cursor: pointer; transition: all 0.2s ease; }
.btn-primary { background: #d4a96a; color: #3b2a1a; font-weight: 700; }
.btn-primary:hover { background: #c49058; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(212,169,106,0.35); }
.btn-sm { padding: 0.4rem 1.1rem; font-size: 0.88rem; }

.btn-ghost {
  background: transparent;
  border: 1.5px solid #d4a96a;
  color: #d4a96a;
  padding: 0.45rem 1.2rem;
  border-radius: 8px;
  font-family: 'Georgia', serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-ghost:hover { background: #d4a96a; color: #3b2a1a; }

/* FEATURED SECTION */
.featured-section { padding: 4rem 3rem; background: #faf5ee; }
.featured-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2.5rem; }
.featured-title { font-family: 'Georgia', serif; font-size: 2rem; color: #3b2a1a; margin-bottom: 0.3rem; }
.featured-sub { color: #8a6a4a; font-size: 0.95rem; }

/* MAGAZINE LAYOUT */
.magazine-layout {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 2rem;
  align-items: start;
}

/* BIG CARD */
.big-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(59,42,26,0.12);
  cursor: pointer;
  transition: transform 0.25s, box-shadow 0.25s;
}
.big-card:hover { transform: translateY(-5px); box-shadow: 0 12px 36px rgba(59,42,26,0.2); }

.big-card-image-wrap { position: relative; height: 300px; overflow: hidden; }
.big-card-img { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform 0.4s; }
.big-card:hover .big-card-img { transform: scale(1.04); }

.genre-badge {
  position: absolute;
  top: 1rem; left: 1rem;
  background: #d4a96a;
  color: #3b2a1a;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.28rem 0.75rem;
  border-radius: 20px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.big-card-body { padding: 1.6rem; }
.card-label { font-size: 0.78rem; color: #d4a96a; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 0.5rem; }
.big-card-title { font-family: 'Georgia', serif; font-size: 1.55rem; font-weight: 700; color: #3b2a1a; margin-bottom: 0.3rem; }
.big-card-author { color: #8a6a4a; font-style: italic; font-size: 0.95rem; margin-bottom: 0.9rem; }
.big-card-desc { color: #6a5040; font-size: 0.92rem; line-height: 1.65; margin-bottom: 1.3rem; }

/* SIDE STACK */
.side-stack { display: flex; flex-direction: column; gap: 1rem; }

.side-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 12px rgba(59,42,26,0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s, border-left-color 0.2s;
  border-left: 3px solid transparent;
}
.side-card:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 20px rgba(59,42,26,0.14);
  border-left-color: #d4a96a;
  background: #fffbf5;
}

.side-card-img { width: 72px; height: 100px; object-fit: cover; border-radius: 6px; flex-shrink: 0; background: #e8d8c0; }
.side-card-body { flex: 1; min-width: 0; }
.side-genre { font-size: 0.7rem; color: #d4a96a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
.side-card-title { font-family: 'Georgia', serif; font-size: 1rem; font-weight: 700; color: #3b2a1a; margin: 0.2rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.side-card-author { font-size: 0.82rem; color: #8a6a4a; font-style: italic; margin-bottom: 0.3rem; }
.side-card-desc { font-size: 0.8rem; color: #7a6050; line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.side-arrow { font-size: 1.1rem; color: #d4a96a; flex-shrink: 0; transition: transform 0.2s; }
.side-card:hover .side-arrow { transform: translateX(3px); }

/* FEATURES */
.features-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; padding: 3.5rem 3rem; background: #3b2a1a; }
.feature-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(212,169,106,0.2); border-radius: 12px; padding: 2rem 1.5rem; text-align: center; transition: background 0.2s; }
.feature-card:hover { background: rgba(255,255,255,0.1); }
.feature-icon { font-size: 2rem; display: block; margin-bottom: 0.8rem; }
.feature-card h3 { font-family: 'Georgia', serif; color: #f5e6c8; font-size: 1.1rem; margin-bottom: 0.5rem; }
.feature-card p { color: #b09070; font-size: 0.9rem; line-height: 1.5; }

/* FOOTER */
.footer { background: #2a1d10; padding: 2.5rem; text-align: center; }
.footer-brand { font-family: 'Georgia', serif; font-size: 1.3rem; color: #d4a96a; font-weight: 700; margin-bottom: 0.5rem; }
.footer-text { color: #8a6a4a; font-size: 0.9rem; margin-bottom: 0.4rem; }
.footer-authors { color: #c4a882; font-size: 0.88rem; }
.footer-authors strong { color: #d4a96a; }
</style>