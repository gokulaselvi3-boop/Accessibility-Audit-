/**
 * API Module - Handles REST API calls and local caching
 * Uses JSONPlaceholder API as data source
 * Implements async/await fetch with error handling
 */

class APIClient {
    constructor() {
        this.baseURL = 'https://jsonplaceholder.typicode.com';
        this.cacheKey = 'apiData_posts';
        this.cacheDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
        this.isLoading = false;
        this.lastError = null;
    }

    /**
     * Fetch posts from API or cache
     * @param {boolean} forceRefresh - Force refresh from API, ignoring cache
     * @returns {Promise<Array>} Array of post objects
     */
    async fetchPosts(forceRefresh = false) {
        try {
            this.isLoading = true;

            // Check cache if not forcing refresh
            if (!forceRefresh) {
                const cachedData = this.getFromCache();
                if (cachedData) {
                    console.log('📦 Loaded from cache');
                    this.isLoading = false;
                    return cachedData;
                }
            }

            console.log('🌐 Fetching from API...');

            // Fetch from API
