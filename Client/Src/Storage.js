/**
 * Storage Module - Persistent state management
 * Handles all localStorage operations for the application
 */

class StorageManager {
    constructor() {
        this.prefix = 'ecoshop_';
    }

    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {any} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
        try {
            const fullKey = this.prefix + key;
            localStorage.setItem(fullKey, JSON.stringify(value));
            console.log(`✅ Saved to storage: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ Storage error: ${error.message}`);
            return false;
        }
    }

    /**
     * Get data from localStorage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if not found
     * @returns {any} Retrieved value or default
     */
    get(key, defaultValue = null) {
        try {
            const fullKey = this.prefix + key;
            const item = localStorage.getItem(fullKey);
            
            if (item === null) {
                return defaultValue;
            }
            
            return JSON.parse(item);
        } catch (error) {
            console.error(`❌ Storage error reading ${key}: ${error.message}`);
            return defaultValue;
        }
    }

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        try {
            const fullKey = this.prefix + key;
            localStorage.removeItem(fullKey);
            console.log(`✅ Removed from storage: ${key}`);
            return true;
        } catch (error) {
            console.error(`❌ Storage error: ${error.message}`);
            return false;
        }
    }

    /**
     * Clear all application data from storage
     * @returns {boolean} Success status
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            console.log('✅ Storage cleared');
            return true;
        } catch (error) {
            console.error(`❌ Storage error: ${error.message}`);
            return false;
        }
    }

    /**
     * Get all storage info
     * @returns {Object} Storage information
     */
    getInfo() {
        const keys = Object.keys(localStorage);
        const appKeys = keys.filter(k => k.startsWith(this.prefix));
        
        return {
            totalKeys: appKeys.length,
            keys: appKeys.map(k => k.replace(this.prefix, '')),
            size: JSON.stringify(localStorage).length,
        };
    }

    /**
     * Save current user
     * @param {Object} user - User object
     */
    saveUser(user) {
        return this.set('currentUser', user);
    }

    /**
     * Get current user
     * @returns {Object|null} User object or null
     */
    getUser() {
        return this.get('currentUser', null);
    }

    /**
     * Save products
     * @param {Array} products - Products array
     */
    saveProducts(products) {
        return this.set('products', products);
    }

    /**
     * Get products
     * @returns {Array} Products array
     */
    getProducts() {
        return this.get('products', []);
    }

    /**
     * Save cart
     * @param {Array} cart - Cart items array
     */
    saveCart(cart) {
        return this.set('cart', cart);
    }

    /**
     * Get cart
     * @returns {Array} Cart items array
     */
    getCart() {
        return this.get('cart', []);
    }

    /**
     * Save orders
     * @param {Array} orders - Orders array
     */
    saveOrders(orders) {
        return this.set('orders', orders);
    }

    /**
     * Get orders
     * @returns {Array} Orders array
     */
    getOrders() {
        return this.get('orders', []);
    }

    /**
     * Initialize with sample data
     */
    initializeSampleData() {
        // Sample products
        const sampleProducts = [
            {
                id: 1,
                name: 'Bamboo Water Bottle',
                description: 'Eco-friendly reusable water bottle made from sustainable bamboo',
                price: 24.99,
                stock: 50,
                emoji: '🎋'
            },
            {
                id: 2,
                name: 'Organic Cotton T-Shirt',
                description: 'Comfortable and sustainable organic cotton t-shirt',
                price: 34.99,
                stock: 30,
                emoji: '👕'
            },
            {
                id: 3,
                name: 'Wooden Phone Stand',
                description: 'Beautiful handcrafted wooden phone stand',
                price: 19.99,
                stock: 25,
                emoji: '📱'
            },
            {
                id: 4,
                name: 'Eco Tote Bag',
                description: 'Durable canvas tote bag for everyday use',
                price: 14.99,
                stock: 100,
                emoji: '🛍️'
            },
            {
                id: 5,
                name: 'Bamboo Utensil Set',
                description: 'Portable bamboo cutlery set with carrying case',
                price: 12.99,
                stock: 40,
                emoji: '🍴'
            },
            {
                id: 6,
                name: 'Natural Soap Bar',
                description: 'Handmade natural soap with organic ingredients',
                price: 8.99,
                stock: 75,
                emoji: '🧼'
            }
        ];

        // Only initialize if not already done
        if (this.getProducts().length === 0) {
            this.saveProducts(sampleProducts);
            console.log('✅ Sample data initialized');
        }
    }
}

// Create singleton instance
const storage = new StorageManager();

// Initialize sample data on first load
storage.initializeSampleData();

console.log('✅ Storage Module loaded');
          
