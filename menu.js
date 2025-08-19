document.addEventListener('DOMContentLoaded', () => {
    // Ensure menuData is loaded (assuming menuData.js is included before this script)
    if (typeof menuData === 'undefined') {
        console.error('menuData is not loaded. Make sure menuData.js is included.');
        return;
    }

    const menuContainer = document.getElementById('full-menu-container'); // Target specific container
    if (!menuContainer) {
        // console.log('Full menu container not found on this page.');
        return; // Don't run if the main menu container isn't present
    }

    const categoryFiltersContainer = menuContainer.querySelector('.category-filters');
    const menuItemsContainer = menuContainer.querySelector('.menu-items');
    const searchInput = menuContainer.querySelector('.menu-search');
    const specialsToggle = menuContainer.querySelector('#specials-toggle-checkbox'); // Assumes checkbox exists
    const specialsToggleContainer = menuContainer.querySelector('.specials-toggle-container');

    let currentFilter = 'All';
    let showSpecialsOnly = false;
    let searchTerm = '';

    // 1. Extract Unique Categories
    const categories = ['All', ...new Set(menuData.map(item => item.category))];

    // 2. Render Category Filters
    function renderCategories() {
        if (!categoryFiltersContainer) return;
        categoryFiltersContainer.innerHTML = ''; // Clear existing
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-filter-btn';
            button.textContent = category;
            button.dataset.category = category;
            if (category === currentFilter) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentFilter = category;
                renderCategories(); // Re-render buttons to update active state
                renderMenuItems();
            });
            categoryFiltersContainer.appendChild(button);
        });
    }

    // 3. Render Menu Items
    function renderMenuItems() {
        if (!menuItemsContainer) return;
        menuItemsContainer.innerHTML = ''; // Clear existing items

        const filteredData = menuData.filter(item => {
            const matchesCategory = currentFilter === 'All' || item.category === currentFilter;
            const matchesSpecials = !showSpecialsOnly || item.isSpecial;
            const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSpecials && matchesSearch;
        });

        if (filteredData.length === 0) {
            menuItemsContainer.innerHTML = '<p>No items match your criteria.</p>';
            return;
        }

        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'menu-item-card';
            // Add data attributes for easier access in event listeners
            card.dataset.id = item.id;
            card.dataset.name = item.name;
            card.dataset.price = item.price;
            card.dataset.image = item.image; // Assuming item has an image property
            
            card.innerHTML = `
                ${item.image ? `<img src="${item.image}" alt="${item.name}" class="menu-item-image">` : ''}
                <div class="menu-item-content">
                    <h3 class="menu-item-name">${item.name} ${item.isVeg ? '<span style="color: green;">(V)</span>' : ''}</h3>
                    <p class="menu-item-desc">${item.description || ''}</p> <!-- Assuming description exists -->
                    <div class="menu-item-tags">
                        ${item.isSpecial ? '<span class="menu-item-tag special">Special</span>' : ''}
                        ${item.isVeg ? '<span class="menu-item-tag veg">Veg</span>' : '<span class="menu-item-tag non-veg">Non-Veg</span>'}
                        <!-- Add other tags if available -->
                    </div>
                    <div class="menu-item-footer">
                        <p class="menu-item-price">₹${item.price.toFixed(2)}</p>
                        <div class="menu-item-buttons">
                            <button class="menu-btn add-to-cart-menu" title="Add to Cart">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                            <button class="menu-btn order-now" title="Order Now">
                                Order Now
                            </button>
                        </div>
                    </div>
                </div>
            `;
            menuItemsContainer.appendChild(card);
        });
    }

    // 4. Event Listeners Setup

    // --- Add Event Listeners for new buttons ---
    function setupMenuButtonListeners() {
        menuItemsContainer.addEventListener('click', function(event) {
            const button = event.target.closest('button');
            if (!button) return; // Exit if click wasn't on a button

            const card = event.target.closest('.menu-item-card');
            if (!card) return; // Should always find a card if button is clicked

            const item = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                image: card.dataset.image,
                quantity: 1
            };

            if (button.classList.contains('add-to-cart-menu')) {
                console.log('Add to Cart clicked:', item);
                // Assuming addToCart function exists globally (from script.js)
                if (typeof addToCart === 'function') {
                    addToCart(item);
                } else {
                    console.error('addToCart function not found.');
                }
            } else if (button.classList.contains('order-now')) {
                console.log('Order Now clicked:', item);
                // Action: Add to cart and open cart sidebar
                if (typeof addToCart === 'function' && typeof openCartSidebar === 'function') {
                    addToCart(item);
                    openCartSidebar(); // Assuming openCartSidebar exists globally
                } else {
                    console.error('addToCart or openCartSidebar function not found.');
                }
                // Alternative: Redirect to a checkout page? 
                // window.location.href = '/checkout.html'; // Example
            }
        });
    }

    // 5. Search Input Handling
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase().trim();
            renderMenuItems();
        });
    }

    // 6. Specials Toggle Handling
    if (specialsToggle && specialsToggleContainer) {
        specialsToggle.addEventListener('change', (e) => {
            showSpecialsOnly = e.target.checked;
            renderMenuItems();
        });
    } else if (specialsToggleContainer) {
        // If container exists but checkbox doesn't, hide the toggle option
        specialsToggleContainer.style.display = 'none';
        console.warn('Specials toggle checkbox not found, hiding the toggle.');
    }

    // Initial Render
    renderCategories();
    renderMenuItems();

    // Add event listeners for new buttons
    setupMenuButtonListeners();

}); 