/**
 * Store Module - Business logic for products, cart, and orders
 * Handles all CRUD operations and state management
 */

class Store {
    constructor() {
        this.products = storage.getProducts();
        this.cart = storage.getCart();
        this.orders = storage.getOrders();
        this.nextProductId = this.getNextProductId();
        this.nextOrderId = this.getNextOrderId();
    }

    /**
     * Get next available product ID
     */
    getNextProductId() {
        if (this.products.length === 0) return 1;
        return Math.max(...this.products.map(p => p.id)) + 1;
    }

    /**
     * Get next available order ID
     */
    getNextOrderId() {
        if (this.orders.length === 0) return 1001;
        return Math.max(...this.orders.map(o => o.id)) + 1;
    }

    /* ========================================
       PRODUCT OPERATIONS (CRUD)
       ======================================== */

    /**
     * Get all products
     */
    getProducts() {
        return this.products;
    }

    /**
     * Get product by ID
     */
    getProduct(id) {
        return this.products.find(p => p.id === id);
    }

    /**
     * Add new product
     */
    addProduct(product) {
        const newProduct = {
            id: this.nextProductId++,
            ...product,
            createdAt: new Date().toISOString(),
        };
        
        this.products.push(newProduct);
        this.saveProducts();
        console.log('✅ Product added:', newProduct);
        return newProduct;
    }

    /**
     * Update product
     */
    updateProduct(id, updates) {
        const product = this.getProduct(id);
        if (!product) {
            throw new Error(`Product ${id} not found`);
        }

        Object.assign(product, updates, {
            updatedAt: new Date().toISOString(),
        });

        this.saveProducts();
        console.log('✅ Product updated:', product);
        return product;
    }

    /**
     * Delete product
     */
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Product ${id} not found`);
        }

        const deleted = this.products.splice(index, 1)[0];
        this.saveProducts();
        console.log('✅ Product deleted:', deleted);
        return deleted;
    }

    /**
     * Save products to storage
     */
    saveProducts() {
        storage.saveProducts(this.products);
    }

    /* ========================================
       CART OPERATIONS
       ======================================== */

    /**
     * Add item to cart
     */
    addToCart(productId, quantity = 1) {
        const product = this.getProduct(productId);
        if (!product) {
            throw new Error(`Product ${productId} not found`);
        }

        if (quantity > product.stock) {
            throw new Error(`Insufficient stock. Available: ${product.stock}`);
        }

        // Check if item already in cart
        const cartItem = this.cart.find(item => item.productId === productId);
        
        if (cartItem) {
            // Update quantity
            const newQuantity = cartItem.quantity + quantity;
            if (newQuantity > product.stock) {
                throw new Error(`Insufficient stock. Available: ${product.stock}`);
            }
            cartItem.quantity = newQuantity;
        } else {
            // Add new item
            this.cart.push({
                productId: productId,
                quantity: quantity,
                addedAt: new Date().toISOString(),
            });
        }

        this.saveCart();
        console.log(`✅ Added to cart: ${product.name} x${quantity}`);
        return this.cart;
    }

    /**
     * Remove item from cart
     */
    removeFromCart(productId) {
        const index = this.cart.findIndex(item => item.productId === productId);
        if (index === -1) {
            throw new Error('Item not in cart');
        }

        const removed = this.cart.splice(index, 1)[0];
        this.saveCart();
        console.log('✅ Removed from cart:', removed);
        return this.cart;
    }

    /**
     * Update cart item quantity
     */
    updateCartQuantity(productId, quantity) {
        const cartItem = this.cart.find(item => item.productId === productId);
        if (!cartItem) {
            throw new Error('Item not in cart');
        }

        if (quantity <= 0) {
            return this.removeFromCart(productId);
        }

        const product = this.getProduct(productId);
        if (quantity > product.stock) {
            throw new Error(`Insufficient stock. Available: ${product.stock}`);
        }

        cartItem.quantity = quantity;
        this.saveCart();
        console.log(`✅ Updated cart quantity: ${productId} x${quantity}`);
        return this.cart;
    }

    /**
     * Get cart items with product details
     */
    getCartWithDetails() {
        return this.cart.map(item => ({
            ...item,
            product: this.getProduct(item.productId),
            subtotal: this.getProduct(item.productId).price * item.quantity,
        }));
    }

    /**
     * Get cart total
     */
    getCartTotal() {
        return this.getCartWithDetails().reduce((sum, item) => sum + item.subtotal, 0);
    }

    /**
     * Clear cart
     */
    clearCart() {
        this.cart = [];
        this.saveCart();
        console.log('✅ Cart cleared');
    }

    /**
     * Save cart to storage
     */
    saveCart() {
        storage.saveCart(this.cart);
    }

    /* ========================================
       ORDER OPERATIONS
       ======================================== */

    /**
     * Create order from cart
     */
    createOrder(customerInfo) {
        if (this.cart.length === 0) {
            throw new Error('Cart is empty');
        }

        const items = this.getCartWithDetails();
        const subtotal = this.getCartTotal();
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;

        const order = {
            id: this.nextOrderId++,
            customer: customerInfo,
            items: items.map(item => ({
                productId: item.productId,
                productName: item.product.name,
                quantity: item.quantity,
                unitPrice: item.product.price,
                subtotal: item.subtotal,
            })),
            subtotal: subtotal,
            tax: tax,
            total: total,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        };

        // Deduct stock
        items.forEach(item => {
            this.updateProduct(item.productId, {
                stock: item.product.stock - item.quantity,
            });
        });

        this.orders.push(order);
        this.saveOrders();
        this.clearCart();
        
        console.log('✅ Order created:', order);
        return order;
    }

    /**
     * Get all orders
     */
    getOrders() {
        return this.orders;
    }

    /**
     * Get order by ID
     */
    getOrder(id) {
        return this.orders.find(o => o.id === id);
    }

    /**
     * Update order status
     */
    updateOrderStatus(orderId, status) {
        const order = this.getOrder(orderId);
        if (!order) {
            throw new Error(`Order ${orderId} not found`);
        }

        order.status = status;
        this.saveOrders();
        console.log('✅ Order status updated:', order);
        return order;
    }

    /**
     * Cancel order
     */
    cancelOrder(orderId) {
        const order = this.getOrder(orderId);
        if (!order) {
            throw new Error(`Order ${orderId} not found`);
        }

        if (order.status === 'cancelled') {
            throw new Error('Order is already cancelled');
        }

        // Restore stock
        order.items.forEach(item => {
            const product = this.getProduct(item.productId);
            if (product) {
                this.updateProduct(item.productId, {
                    stock: product.stock + item.quantity,
                });
            }
        });

        order.status = 'cancelled';
        this.saveOrders();
        console.log('✅ Order cancelled:', order);
        return order;
    }

    /**
     * Save orders to storage
     */
    saveOrders() {
        storage.saveOrders(this.orders);
    }

    /* ========================================
       UTILITY METHODS
       ======================================== */

    /**
     * Get product statistics
     */
    getStats() {
        return {
            totalProducts: this.products.length,
            cartItems: this.cart.length,
            totalOrders: this.orders.length,
            totalRevenue: this.orders.reduce((sum, order) => sum + order.total, 0),
            lowStockProducts: this.products.filter(p => p.stock < 10),
        };
    }

    /**
     * Search products
     */
    searchProducts(query) {
        const q = query.toLowerCase();
        return this.products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
    }

    /**
     * Export data as JSON
     */
    export() {
        return {
            products: this.products,
            cart: this.cart,
            orders: this.orders,
            exportedAt: new Date().toISOString(),
        };
    }

    /**
     * Import data from JSON
     */
    import(data) {
        try {
            if (data.products) {
                this.products = data.products;
                this.saveProducts();
            }
            if (data.orders) {
                this.orders = data.orders;
                this.saveOrders();
            }
            if (data.cart) {
                this.cart = data.cart;
                this.saveCart();
            }
            console.log('✅ Data imported');
            return true;
        } catch (error) {
            console.error('❌ Import error:', error);
            return false;
        }
    }
}

// Create singleton instance
const store = new Store();

console.log('✅ Store Module loaded');
          
