// Initialize an empty cart
let cart = [];

// Fetch products from the Fake Store API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        displayProducts(products);
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products on the page
function displayProducts(products) {
    const productContainer = document.getElementById('products');
    productContainer.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="100" height="100"/>
            <h3 class="PTitle">${product.title}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
        `;
        productContainer.appendChild(productElement);
    });
}

// Add items to the cart
function addToCart(id, title, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, title, price, quantity: 1 });
    }

    displayCart();
}

// Display the cart items
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; // Clear previous cart items

    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            ${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}
            <button onclick="increaseQuantity(${item.id})">+</button>
            <button onclick="decreaseQuantity(${item.id})">-</button>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });

    // If cart is empty, display a message
    if (cart.length === 0) {
        cartItems.innerHTML = '<li>Your cart is empty.</li>';
    }
}

// Remove items from the cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    displayCart();
}

// Increase the quantity of an item in the cart
function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    item.quantity++;
    displayCart();
}

// Decrease the quantity of an item in the cart
function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);

    if (item.quantity > 1) {
        item.quantity--;
    } else {
        removeFromCart(id);
    }

    displayCart();
}

// Implement search functionality
document.getElementById('search').addEventListener('input', async function(event) {
    const searchTerm = event.target.value.toLowerCase();

    // Fetch all products and filter based on search term
    const products = await fetchProducts();
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
});

// Fetch and display the products on page load
fetchProducts();
