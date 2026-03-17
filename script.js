// Product Data
const products = [
    {
        id: 'school_bag',
        name: 'Vibrant Journey Backpack',
        category: 'School Collection',
        price: 1899,
        image: 'images/school_bag.png',
        rating: 4.8,
        description: 'A vibrant, durable school backpack suitable for teenagers and students. Ergonomically designed with padded shoulder straps to ensure all-day comfort. Features multiple compartments for textbooks, a dedicated laptop sleeve, and water bottle holders.',
        specs: [
            'Ergonomic padded straps',
            '15" laptop sleeve compartment',
            'Water-resistant durable material',
            'Volume: 25 Liters'
        ]
    },
    {
        id: 'office_bag',
        name: 'Executive Leather Messenger',
        category: 'Office Collection',
        price: 3499,
        image: 'images/office_bag.png',
        rating: 4.9,
        description: 'A sleek, premium leather office messenger bag suitable for professionals. Features a minimalist design with a dark, professional aesthetic. Designed to carry your essentials seamlessly from the commute to the boardroom.',
        specs: [
            'Genuine premium leather',
            'Fits laptops up to 16-inches',
            'Adjustable carrying strap',
            'Magnetic quick-access closures'
        ]
    },
    {
        id: 'college_bag',
        name: 'Trendy Campus Tote',
        category: 'College Collection',
        price: 1599,
        image: 'images/college_bag.png',
        rating: 4.7,
        description: 'A trendy, stylish canvas tote or daypack suitable for college students. Blends modern aesthetic with casual, premium vibes. Spacious enough for books, a tablet, and daily campus essentials.',
        specs: [
            'Heavy-duty sustainable canvas',
            'Reinforced stitching',
            'Interior zip pocket for valuables',
            'Machine washable'
        ]
    }
];

// Initialize Cart State (store array of items instead of just count)
let cartItems = JSON.parse(localStorage.getItem('woozy_cart_items')) || [];

function updateCartCounter() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounters = document.querySelectorAll('.cart-count');
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.transform = 'scale(1.2)';
        setTimeout(() => counter.style.transform = 'scale(1)', 200);
    });
    localStorage.setItem('woozy_cart_items', JSON.stringify(cartItems));
}

// Ensure the counter is updated on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
    const searchInput = document.getElementById('searchInput');

    // Check if we are on the homepage
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        // Handle search query from URL parameter if redirected
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        let initialProducts = products;
        
        if (searchQuery) {
            if (searchInput) searchInput.value = searchQuery;
            initialProducts = products.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        renderProducts(initialProducts, productGrid);
        
        // Live search on homepage
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = products.filter(p => 
                    p.name.toLowerCase().includes(query) || 
                    p.category.toLowerCase().includes(query)
                );
                renderProducts(filtered, productGrid);
            });
        }
    } else {
        // Not on homepage, redirect on enter key
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value;
                    window.location.href = `index.html?search=${encodeURIComponent(query)}`;
                }
            });
        }
    }

    // Check if we are on the product page
    const productDetailSection = document.getElementById('productDetailSection');
    if (productDetailSection) {
        renderProductDetails();
    }

    // Check if we are on the login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        setupLoginForm(loginForm);
    }

    // Check if we are on the cart page
    const cartContainer = document.getElementById('cartContainer');
    if (cartContainer) {
        renderCart();
    }
});

function setupLoginForm(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        // Simulate login success
        showToast(`Welcome back, ${email.split('@')[0]}!`);
        
        // Redirect to homepage after brief delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

function renderProducts(productsToRender, container) {
    container.innerHTML = '';
    
    if (productsToRender.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
                <i class='bx bx-search' style="font-size: 4rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <h3>No bags found</h3>
                <p style="color: var(--text-light);">Try a different search term.</p>
            </div>
        `;
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <div class="card-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="card-content">
                <span class="category">${product.category}</span>
                <h3>${product.name}</h3>
                <div class="price-rating">
                    <span class="price">₹${product.price}</span>
                    <span class="rating">
                        <i class='bx bxs-star'></i> ${product.rating}
                    </span>
                </div>
                <a href="product.html?id=${product.id}" class="btn view-btn">View Details</a>
            </div>
        `;
        container.appendChild(productCard);
    });
}

function renderProductDetails() {
    // Get the product ID from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Find the product
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        document.getElementById('productDetailSection').innerHTML = `
            <div style="text-align: center; padding: 5rem;">
                <h2>Product Not Found</h2>
                <a href="index.html" class="btn primary-btn" style="margin-top: 2rem;">Back to Shop</a>
            </div>
        `;
        return;
    }

    // Update Page Title
    document.title = `${product.name} | WOOZY Store`;

    // Render Data
    document.getElementById('productImg').src = product.image;
    document.getElementById('productImg').alt = product.name;
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `₹${product.price}`;
    document.getElementById('productDescription').textContent = product.description;
    
    const specsList = document.getElementById('productSpecs');
    specsList.innerHTML = '';
    product.specs.forEach(spec => {
        const li = document.createElement('li');
        li.innerHTML = `<i class='bx bx-check-circle'></i> ${spec}`;
        specsList.appendChild(li);
    });

    // Add to Cart Logic
    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.addEventListener('click', () => {
        // Check if item already exists
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: 1
            });
        }
        
        updateCartCounter();
        showToast(`${product.name} added to cart!`);
    });
}

function renderCart() {
    const container = document.getElementById('cartContainer');
    
    if (cartItems.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <i class='bx bx-shopping-bag'></i>
                <h3>Your cart is empty</h3>
                <p style="color: var(--text-light); margin-bottom: 2rem;">Looks like you haven't added anything yet.</p>
                <a href="index.html" class="btn primary-btn">Start Shopping</a>
            </div>
        `;
        return;
    }

    let cartHTML = '';
    let subtotal = 0;

    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <span>${item.category}</span>
                    <div class="cart-item-price">₹${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${index}, -1)"><i class='bx bx-minus'></i></button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)"><i class='bx bx-plus'></i></button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${index})" title="Remove">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        `;
    });

    const tax = subtotal * 0.08; // 8% estimated tax
    const total = subtotal + tax;

    cartHTML += `
        <div class="cart-summary">
            <a href="index.html" class="btn secondary-btn" style="height: fit-content;">Continue Shopping</a>
            <div class="cart-total">
                <span>Subtotal: ₹${subtotal.toFixed(2)}</span>
                <span>Est. Tax (8%): ₹${tax.toFixed(2)}</span>
                <h3>Total: ₹${total.toFixed(2)}</h3>
                <button class="btn primary-btn" style="margin-top: 1rem; width: 100%;" onclick="checkout()">
                    <i class='bx bx-check-shield'></i> Secure Checkout
                </button>
            </div>
        </div>
    `;

    container.innerHTML = cartHTML;
}

window.updateQuantity = function(index, change) {
    if (cartItems[index].quantity + change > 0) {
        cartItems[index].quantity += change;
        updateCartCounter();
        renderCart();
    }
};

window.removeFromCart = function(index) {
    cartItems.splice(index, 1);
    updateCartCounter();
    renderCart();
};

window.checkout = function() {
    if (cartItems.length === 0) return;
    showToast('Order placed successfully! Thank you for shopping with WOOZY.');
    cartItems = [];
    updateCartCounter();
    renderCart();
}

function showToast(message) {
    const existing = document.querySelector('.toast-container');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.className = 'toast-container';
    
    container.innerHTML = `
        <div class="toast show">
            <i class='bx bxs-check-circle'></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(container);
    
    // Trigger layout before animating
    container.offsetHeight; 
    
    const toast = container.querySelector('.toast');
    setTimeout(() => {
        if(toast) toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        if(toast) {
            toast.classList.remove('show');
            setTimeout(() => container.remove(), 400);
        }
    }, 3000);
}
