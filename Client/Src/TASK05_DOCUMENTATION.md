# Task 05: Dynamic JavaScript DOM Logic & RESTful API Client

Complete implementation of real-time data fetching, filtering, searching, and state management with localStorage caching.

## 📋 Project Overview

This project demonstrates modern JavaScript practices for building dynamic, data-driven web applications with:

- **REST API Integration** - Async/await fetch calls to JSONPlaceholder API
- **Real-time Filtering** - Dynamic search, category filtering, and sorting
- **DOM Manipulation** - Efficient rendering without full-page reloads
- **State Management** - Client-side state with localStorage persistence
- **Error Handling** - User-friendly error messages and fallback mechanisms
- **Loading States** - Skeleton screens and loading indicators

## 🏗️ Project Structure

```
project/
├── index-task05.html    # Main HTML file (all styles embedded)
├── api.js               # API Module (REST calls & caching)
├── app.js               # Application Module (DOM & state logic)
└── TASK05_DOCUMENTATION.md  # This file
```

## 🔧 Architecture

### Module Pattern: APIClient

**File:** `api.js`

Handles all REST API interactions and local caching.

```javascript
class APIClient {
    // API Methods
    async fetchPosts(forceRefresh = false)
    async fetchUser(userId)
    async fetchComments(postId)

    // Cache Methods
    saveToCache(data)
    getFromCache(allowStale = false)
    clearCache()
    getCacheInfo()

    // Utility Methods
    getCategory(index)
    formatTime(ms)
    getLastError()
    getLoadingState()
}
```

#### Key Features:

1. **Async/Await Fetch**
   ```javascript
   async fetchPosts(forceRefresh = false) {
       const response = await fetch(`${this.baseURL}/posts`);
       if (!response.ok) throw new Error(...);
       return await response.json();
   }
   ```

2. **Intelligent Caching**
   - 30-minute cache duration
   - Automatic expiration checking
   - Fallback to stale cache on network errors
   - localStorage-based persistence

3. **Error Handling**
   ```javascript
   try {
       // API call
   } catch (error) {
       // Store error state
       this.lastError = { message, type, timestamp };
       // Return cached data if available
       return this.getFromCache(true);
   }
   ```

4. **Data Enhancement**
   ```javascript
   const enrichedData = data.map((post, index) => ({
       ...post,
       category: this.getCategory(index),
       isFavorite: false,
       isArchived: false,
       isDraft: false,
       createdAt: new Date(...),
   }));
   ```

### Module Pattern: Application

**File:** `app.js`

Handles DOM manipulation, state management, and user interactions.

```javascript
class Application {
    // State Properties
    allPosts = []
    filteredPosts = []
    currentTab = 'all'
    searchQuery = ''
    selectedCategory = ''
    sortBy = 'newest'

    // Main Methods
    async init()
    async loadData(forceRefresh)
    applyFilters()
    render()
    
    // Filter Methods
    sortPosts(posts)
    
    // DOM Methods
    createCard(post)
    render()
    showAlert(message, type)
    showEmptyState()
    showSkeletonLoading()
    animateCards()
}
```

#### Key Features:

1. **Real-Time Search with Debouncing**
   ```javascript
   let searchTimeout;
   searchInput.addEventListener('input', (e) => {
       clearTimeout(searchTimeout);
       searchTimeout = setTimeout(() => {
           this.searchQuery = e.target.value.toLowerCase();
           this.applyFilters();
       }, 300); // 300ms debounce
   });
   ```

2. **Multi-Filter System**
   ```javascript
   applyFilters() {
       let filtered = [...this.allPosts];
       
       // Apply search
       if (this.searchQuery) {
           filtered = filtered.filter(post => ...);
       }
       
       // Apply category
       if (this.selectedCategory) {
           filtered = filtered.filter(post => ...);
       }
       
       // Apply tab
       filtered = filtered.filter(post => {
           if (this.currentTab === 'favorites') return post.isFavorite;
           // ... etc
       });
       
       // Apply sorting
       filtered = this.sortPosts(filtered);
       
       this.render();
   }
   ```

3. **DOM Manipulation Without Reloads**
   ```javascript
   render() {
       this.elements.contentGrid.innerHTML = '';
       this.filteredPosts.forEach(post => {
           const card = this.createCard(post);
           this.elements.contentGrid.appendChild(card);
       });
   }
   ```

4. **Error Handling & User Feedback**
   ```javascript
   showAlert(message, type = 'info') {
       const alert = document.createElement('div');
       alert.className = `alert alert-${type}`;
       // ... render alert
       // Auto-dismiss after 5 seconds
   }
   ```

5. **Loading States**
   ```javascript
   showSkeletonLoading() {
       // Show animated skeleton screens
       // Better UX than bare loading spinners
   }
   ```

## 📡 REST API Integration

### Using JSONPlaceholder API

**Base URL:** `https://jsonplaceholder.typicode.com`

#### Endpoints Used:

1. **Get All Posts**
   ```javascript
   GET /posts
   Returns: Array of 100 posts
   ```

2. **Get Single Post**
   ```javascript
   GET /posts/:id
   Returns: Single post object
   ```

3. **Get User Info**
   ```javascript
   GET /users/:id
   Returns: User object with name, email, etc.
   ```

4. **Get Post Comments**
   ```javascript
   GET /posts/:postId/comments
   Returns: Array of comments for post
   ```

### Async/Await Pattern

```javascript
// Fetch with proper error handling
async fetchPosts(forceRefresh = false) {
    try {
        this.isLoading = true;
        
        // Check cache first
        if (!forceRefresh) {
            const cached = this.getFromCache();
            if (cached) return cached;
        }
        
        // Fetch from API
        const response = await fetch(`${this.baseURL}/posts`);
        
        // Check response status
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        // Parse JSON
        const data = await response.json();
        
        // Validate data
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format');
        }
        
        // Save to cache
        this.saveToCache(data);
        
        return data;
        
    } catch (error) {
        // Store error
        this.lastError = error;
        
        // Return stale cache on error
        return this.getFromCache(true);
        
    } finally {
        this.isLoading = false;
    }
}
```

## 💾 LocalStorage Caching System

### Cache Strategy

```javascript
// Cache structure in localStorage
{
    "apiData_posts": {
        "data": [...posts],
        "timestamp": 1633024800000
    }
}
```

### Cache Duration

```javascript
this.cacheDuration = 30 * 60 * 1000; // 30 minutes
```

### Cache Operations

```javascript
// Save to cache
saveToCache(data) {
    const cacheData = {
        data: data,
        timestamp: Date.now(),
    };
    localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
}

// Get from cache (check expiration)
getFromCache(allowStale = false) {
    const cached = JSON.parse(localStorage.getItem(this.cacheKey));
    const cacheAge = Date.now() - cached.timestamp;
    
    if (!allowStale && cacheAge > this.cacheDuration) {
        return null; // Cache expired
    }
    
    return cached.data;
}

// Get cache info
getCacheInfo() {
    return {
        exists: true,
        itemCount: data.length,
        age: '2m 30s',
        isExpired: false,
        expiresIn: '27m 30s',
    };
}
```

### Favorites Persistence

```javascript
// Save favorites separately
saveFavoritesToStorage() {
    const favorites = this.allPosts
        .filter(p => p.isFavorite)
        .map(p => p.id);
    localStorage.setItem('favoritePostIds', JSON.stringify(favorites));
}

// Load favorites on init
loadFavoritesFromStorage() {
    const favorites = JSON.parse(localStorage.getItem('favoritePostIds'));
    this.allPosts.forEach(post => {
        post.isFavorite = favorites.includes(post.id);
    });
}
```

## 🔍 Search & Filtering

### Real-Time Search

```javascript
// Search with debouncing
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        this.searchQuery = e.target.value.toLowerCase();
        this.applyFilters();
    }, 300);
});

// Multi-field search
if (this.searchQuery) {
    filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(this.searchQuery) ||
        post.body.toLowerCase().includes(this.searchQuery) ||
        post.userId.toString().includes(this.searchQuery)
    );
}
```

### Category Filtering

```javascript
if (this.selectedCategory) {
    filtered = filtered.filter(post =>
        post.category === this.selectedCategory
    );
}
```

### Tab-Based Filtering

```javascript
filtered = filtered.filter(post => {
    if (this.currentTab === 'favorites') return post.isFavorite;
    if (this.currentTab === 'archived') return post.isArchived;
    if (this.currentTab === 'drafts') return post.isDraft;
    return !post.isArchived; // Default: show non-archived
});
```

### Sorting Options

```javascript
sortPosts(posts) {
    const sorted = [...posts];
    
    switch (this.sortBy) {
        case 'newest':
            return sorted.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
        case 'oldest':
            return sorted.sort((a, b) => 
                new Date(a.createdAt) - new Date(b.createdAt)
            );
        case 'title-asc':
            return sorted.sort((a, b) => 
                a.title.localeCompare(b.title)
            );
        case 'title-desc':
            return sorted.sort((a, b) => 
                b.title.localeCompare(a.title)
            );
    }
}
```

## ⚠️ Error Handling

### API Errors

```javascript
try {
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
    
} catch (error) {
    this.lastError = {
        message: error.message,
        type: 'api_error',
        timestamp: new Date(),
    };
    
    // Return stale cache
    return this.getFromCache(true);
}
```

### Network Errors

```javascript
if (error.message.includes('API Error')) {
    // API Error
} else {
    // Network error (offline, CORS, etc.)
    this.lastError.type = 'network_error';
}
```

### User-Friendly Error Display

```javascript
showAlert(
    `❌ Failed to load data: ${error.message}`,
    'error'
);
```

### Error Recovery

```javascript
// Try cache if API fails
const staleCache = this.getFromCache(true);
if (staleCache) {
    console.log('⚠️ Using stale cache due to error');
    return staleCache;
}
```

## 🎨 Loading States

### Skeleton Loading

```javascript
showSkeletonLoading() {
    this.elements.contentGrid.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'card';
        skeleton.innerHTML = `
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
        `;
        this.elements.contentGrid.appendChild(skeleton);
    }
}
```

### Loading Indicator

```javascript
showLoading(isLoading) {
    if (isLoading && this.allPosts.length === 0) {
        this.showSkeletonLoading();
    }
    
    this.elements.refreshBtn.disabled = isLoading;
}
```

### Animated Cards

```javascript
animateCards() {
    const cards = this.elements.contentGrid.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}
```

## 🚀 Usage

### Basic Setup

```html
<!-- Include modules -->
<script src="api.js"></script>
<script src="app.js"></script>

<!-- Modules initialize automatically -->
```

### API Methods

```javascript
// Access API client (global singleton)
apiClient.fetchPosts()           // Fetch all posts
apiClient.fetchPosts(true)       // Force refresh
apiClient.fetchUser(userId)      // Fetch user info
apiClient.fetchComments(postId)  // Fetch comments

// Cache operations
apiClient.getFromCache()         // Get cached data
apiClient.getCacheInfo()         // Get cache metadata
apiClient.clearCache()           // Clear cache
```

### App Methods

```javascript
// Access app instance (global)
app.loadData(true)              // Load/refresh data
app.applyFilters()              // Apply all filters
app.render()                     // Re-render cards
app.showAlert(msg, type)         // Show notification
```

### State Properties

```javascript
app.searchQuery       // Current search text
app.selectedCategory  // Current category filter
app.currentTab        // Current tab (all, favorites, etc.)
app.sortBy           // Sort order
app.allPosts         // All posts from API
app.filteredPosts    // Filtered/sorted posts
```

## 📊 Performance Considerations

### Debouncing Search

```javascript
// Prevents excessive filtering
let searchTimeout;
input.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        applyFilters(); // Only called after 300ms of inactivity
    }, 300);
});
```

### Efficient DOM Updates

```javascript
// Only update changed elements instead of full re-render
toggleFavorite(postId) {
    const post = this.allPosts.find(p => p.id === postId);
    post.isFavorite = !post.isFavorite;
    
    // Update only the card element
    const card = document.querySelector(`[data-post-id="${postId}"]`);
    if (card) {
        const btn = card.querySelector('[data-action="favorite"]');
        btn.textContent = post.isFavorite ? '❤️' : '🤍';
    }
}
```

### Array Cloning

```javascript
// Create new arrays to avoid mutating originals
applyFilters() {
    let filtered = [...this.allPosts]; // Clone array
    // Apply filters...
    this.filteredPosts = filtered;
}
```

## 🧪 Testing Checklist

### Functionality
- [ ] Posts load from API
- [ ] Search filters results in real-time
- [ ] Category filter works
- [ ] Sorting options work
- [ ] Tab switching works
- [ ] Favorites toggle works
- [ ] Refresh button works

### Caching
- [ ] Data persists in localStorage
- [ ] Cache expires after 30 minutes
- [ ] Stale cache used on network error
- [ ] Cache can be cleared

### Error Handling
- [ ] Error messages display
- [ ] Alerts auto-dismiss
- [ ] App works offline (with cache)
- [ ] Network errors show friendly message

### Performance
- [ ] Search is debounced
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Skeleton loading shows

### Responsive
- [ ] Works on mobile (1 column)
- [ ] Works on tablet (2 columns)
- [ ] Works on desktop (3 columns)
- [ ] No horizontal scrollbars

## 🎓 Learning Outcomes

After completing this project, you understand:

1. **REST API Consumption** - Async/await fetch patterns
2. **State Management** - Client-side state handling
3. **DOM Manipulation** - Efficient rendering without jQuery
4. **Caching Strategies** - localStorage for offline resilience
5. **Error Handling** - Graceful fallbacks and user feedback
6. **Real-time Filtering** - Debounced search and multi-filter logic
7. **Module Pattern** - Separating concerns into reusable modules
8. **UX Best Practices** - Loading states, error messages, smooth transitions

## 📝 Code Quality

### Modular Architecture
- ✅ Separated API logic (api.js)
- ✅ Separated DOM logic (app.js)
- ✅ Single Responsibility Principle
- ✅ DRY (Don't Repeat Yourself)

### Error Handling
- ✅ Try/catch blocks
- ✅ User-friendly error messages
- ✅ Fallback mechanisms
- ✅ Graceful degradation

### Performance
- ✅ Debounced search
- ✅ Efficient DOM updates
- ✅ Cached API responses
- ✅ Optimized animations

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Error notifications

## 🚢 Deployment

### GitHub Repository

```
repo/
├── index-task05.html
├── api.js
├── app.js
└── README.md
```

### Live Deployment

1. Push to GitHub
2. Enable GitHub Pages
3. Deploy from main branch
4. Share public URL

### Browser Compatibility

| Feature | Support |
|---------|---------|
| Fetch API | Chrome 42+, Firefox 39+, Safari 10.1+ |
| Async/Await | Chrome 55+, Firefox 52+, Safari 11+ |
| localStorage | All modern browsers |
| CSS Grid | Chrome 57+, Firefox 52+, Safari 10.1+ |

---

**Status:** ✅ Production Ready  
**Last Updated:** September 22, 2026  
**Version:** 1.0.0
