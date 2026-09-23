/**
 * Application Module - Main app logic and DOM manipulation
 * Handles real-time search, filtering, sorting, and state management
 */

class Application {
    constructor() {
        // State
        this.allPosts = [];
        this.filteredPosts = [];
        this.currentTab = 'all';
        this.searchQuery = '';
        this.selectedCategory = '';
        this.sortBy = 'newest';

        // DOM Elements
        this.elements = {
            contentGrid: document.getElementById('contentGrid'),
            emptyState: document.getElementById('emptyState'),
            searchInput: document.getElementById('searchInput'),
            categorySelect: document.getElementById('categorySelect'),
            sortSelect: document.getElementById('sortSelect'),
            refreshBtn: document.getElementById('refreshBtn'),
            alertsContainer: document.getElementById('alertsContainer'),
            tabsContainer: document.getElementById('tabsContainer'),
        };

        // Initialize
        this.init();
    }

    /**
     * Initialize application
     */
    async init() {
        console.log('🚀 Initializing application...');
      
