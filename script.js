// Add interactive JavaScript here if needed in the future 

// Apple-inspired homepage enhancements

document.addEventListener('DOMContentLoaded', function() {
    // FIXED REDIRECTION LOGIC - Completely rewritten
    const isLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    
    // More robust path extraction
    const fullPath = window.location.pathname;
    const pathSegments = fullPath.split('/');
    const currentPage = pathSegments[pathSegments.length - 1] || 'index.html';
    
    console.log('Debug - Current page:', currentPage);
    console.log('Debug - Login status:', isLoggedIn);
    
    // Define both directions of page mapping
    const regularToLoggedIn = {
        'homepage.html': 'homepage2.html',
        'about.html': 'about2.html',
        'menu.html': 'menu2.html',
        'contact.html': 'contact2.html',
        'signin.html': 'homepage2.html',
        'index.html': 'homepage2.html',
        '': 'homepage2.html'
    };
    
    // Reverse mapping (for checking if we're on a logged-in page)
    const loggedInPages = new Set(['homepage2.html', 'about2.html', 'menu2.html', 'contact2.html']);
    
    // ONLY redirect logged-in users FROM regular pages TO logged-in versions
    if (isLoggedIn && regularToLoggedIn[currentPage]) {
        const destination = regularToLoggedIn[currentPage];
        // Avoid redirect loops by checking if we're already heading to the destination
        if (!fullPath.endsWith(destination)) {
            console.log(`Redirecting logged-in user to ${destination}`);
            window.location.replace(destination);
            return; // Stop script execution
        }
    }
    
    // Sticky header
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Fade-in animations for sections
    const sections = document.querySelectorAll('.hero, .specials-section, .testimonials-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            hero.style.backgroundPosition = `center ${scrollY * 0.3}px`;
        });
    }

    // Add hover effects to special items and testimonials
    const cards = document.querySelectorAll('.special-item, .testimonial');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        });
    });

    cards.forEach(card => observer.observe(card)); // Observe specials and testimonials for hover effects - might need adjustment

    // Initialize order tracking
    initializeOrderTracking();
    
    // Initialize offer animations
    initializeOfferAnimations();
    
    // Initialize reservation system
    initializeReservationSystem();

    // Initialize cart
    initializeCart();

    // Handle order form submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const orderData = Object.fromEntries(formData.entries());
            
            // Store order data in localStorage
            localStorage.setItem('orderData', JSON.stringify(orderData));
            
            // Redirect to brand page
            window.location.href = 'brand.html';
        });
    }

    // Update order summary on brand page
    const orderData = localStorage.getItem('orderData');
    if (orderData) {
        const data = JSON.parse(orderData);
        const orderSummary = document.querySelector('.order-summary');
        if (orderSummary) {
            orderSummary.innerHTML = `
                <h3>Order Summary</h3>
                <p>Name: ${data.name}</p>
                <p>Order Type: ${data.orderType}</p>
                <p>Payment Method: ${data.paymentMethod}</p>
            `;
        }
    }

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const item = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                image: this.dataset.image,
                quantity: 1
            };
            addToCart(item);
        });
    });

    // Declare shared DOM elements only once
    const signInBtn = document.querySelector('.sign-in-btn');
    const signInModal = document.querySelector('.sign-in-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeModal = document.querySelector('.close-modal');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    const orderBtns = document.querySelectorAll('.order-btn');
    const cartNavLink = document.querySelector('.cart-nav-link');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');

    // Handle order button clicks
    orderBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'signin.html';
        });
    });

    // --- SIGN-IN STATE MANAGEMENT ---
    // Use localStorage to persist login state across pages
    let isSignedIn = localStorage.getItem('isUserLoggedIn') === 'true'; 

    function updateSignInUI() {
        const signInBtn = document.querySelector('.sign-in-btn'); // Assuming this exists on all relevant pages
        const profileDropdown = document.querySelector('.profile-dropdown'); // For homepage2 etc.
        const userProfileBtn = document.querySelector('.user-profile-btn'); // For menu2 etc.

        // Update based on actual state from localStorage
        isSignedIn = localStorage.getItem('isUserLoggedIn') === 'true';

        if (isSignedIn) {
            // Logic to show logged-in state (Sign Out button, profile links)
            if (signInBtn && !signInBtn.closest('.profile-dropdown')) {
                 // Standard Sign In button becomes Sign Out
                 signInBtn.textContent = 'Sign Out';
                 signInBtn.classList.add('signed-in');
                 signInBtn.href = '#'; // Prevent linking to signin.html
            } else {
                // Hide standard sign-in button if profile dropdown exists
                if(signInBtn) signInBtn.style.display = 'none';
            }
            if(profileDropdown) profileDropdown.style.display = 'inline-block'; // Show profile dropdown
            if(userProfileBtn) userProfileBtn.style.display = 'list-item'; // Show profile button in list

        } else {
            // Logic to show logged-out state (Sign In button)
            if (signInBtn && !signInBtn.closest('.profile-dropdown')) {
                 signInBtn.textContent = 'Sign In';
                 signInBtn.classList.remove('signed-in');
                 signInBtn.href = 'signin.html'; // Link to signin.html
                 signInBtn.style.display = 'list-item'; 
            }
             if(profileDropdown) profileDropdown.style.display = 'none'; // Hide profile dropdown
             if(userProfileBtn) userProfileBtn.style.display = 'none'; // Hide profile button
        }
    }

    // Call updateSignInUI once initially to set the correct state on page load
    updateSignInUI();

    // Sign In Modal Functionality
    if (signInBtn && !signInBtn.closest('.profile-dropdown')) { // Only attach listener if it's the main sign-in/out button
    signInBtn.addEventListener('click', function(e) {
            isSignedIn = localStorage.getItem('isUserLoggedIn') === 'true'; // Re-check state
        if (isSignedIn) {
            // Sign out
                e.preventDefault(); // Prevent navigation if it's currently a link
                localStorage.removeItem('isUserLoggedIn');
            isSignedIn = false;
            updateSignInUI();
                // Redirect to homepage after sign out
                window.location.href = 'homepage.html'; 
            // Optionally close cart if open
                if(cartSidebar) cartSidebar.classList.remove('active');
                if(cartOverlay) cartOverlay.classList.remove('active');
                if(document.body) document.body.style.overflow = '';
        } else {
                 // If it's a 'Sign In' button, default link behavior to signin.html works
                 // If modal exists, show it (though linking might be preferred)
                 if (signInModal && modalOverlay) {
                      e.preventDefault(); // Prevent default link navigation
            signInModal.classList.add('active');
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
                 }
        }
    });
    }

    // Close modal
    function closeSignInModal() {
        if(signInModal) signInModal.classList.remove('active');
        if(modalOverlay) modalOverlay.classList.remove('active');
        if(document.body) document.body.style.overflow = '';
    }

    if(closeModal) closeModal.addEventListener('click', closeSignInModal);
    if(modalOverlay) modalOverlay.addEventListener('click', closeSignInModal);

    // Tab switching (Ensure elements exist before adding listeners)
    if(tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tab}Form`) {
                    form.classList.add('active');
                }
            });
        });
    });
    }

    // Form submissions (Ensure forms exist)
    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
            // ... validation ...
            console.log('Sign in attempt...');
            localStorage.setItem('isUserLoggedIn', 'true');
        isSignedIn = true;
        updateSignInUI();
        closeSignInModal();
            
            // Get current page to decide where to redirect
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            const regularToLoggedIn = {
                'homepage.html': 'homepage2.html',
                'about.html': 'about2.html',
                'menu.html': 'menu2.html',
                'contact.html': 'contact2.html',
                'signin.html': 'homepage2.html',
                'index.html': 'homepage2.html',
                '': 'homepage2.html'
            };
            
            // Redirect to appropriate logged-in page based on current page
            const destination = regularToLoggedIn[currentPath] || 'homepage2.html';
            window.location.href = destination;
    });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
            // ... validation ... 
            if (document.getElementById('signup-password').value !== document.getElementById('signup-confirm-password').value) {
            alert('Passwords do not match!');
            return;
        }
            console.log('Sign up attempt...');
            localStorage.setItem('isUserLoggedIn', 'true');
        isSignedIn = true;
        updateSignInUI();
        closeSignInModal();
             // Redirect to logged-in homepage
             window.location.href = 'homepage2.html'; 
        });
    }

    // Cart icon in nav bar requires sign in
    if (cartNavLink) {
        cartNavLink.addEventListener('click', function(e) {
            e.preventDefault();
            isSignedIn = localStorage.getItem('isUserLoggedIn') === 'true'; // Re-check state
            if (isSignedIn) {
                if(cartSidebar) cartSidebar.classList.add('active');
                if(cartOverlay) cartOverlay.classList.add('active');
                if(document.body) document.body.style.overflow = 'hidden';
            } else {
                alert('Please sign in to view your cart.');
                 // Optionally redirect to signin page or open modal
                 window.location.href = 'signin.html'; 
                 /* Or open modal if preferred: 
                 if (signInModal && modalOverlay) {
                signInModal.classList.add('active');
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                 }
                 */
            }
        });
    }

    // --- HOMEPAGE DYNAMIC MENU LOGIC ---
    function initializeHomepageDynamicMenu() {
        const dynamicMenuSection = document.querySelector('.dynamic-menu-section');
        if (!dynamicMenuSection) return; // Only run on homepage

        // Check if menuData is loaded
        if (typeof menuData === 'undefined') {
            console.error('Homepage Menu Error: menuData is not loaded. Make sure menuData.js is included before script.js');
            dynamicMenuSection.innerHTML = '<p>Error loading menu data.</p>'; // Inform user
            return;
        }

        const timeIndicator = dynamicMenuSection.querySelector('.menu-time-indicator .current-menu');
        const toggleButtons = dynamicMenuSection.querySelectorAll('.menu-toggle-btn');
        const toggleBackground = dynamicMenuSection.querySelector('.toggle-background');
        const categoryContainer = dynamicMenuSection.querySelector('.menu-categories');
        const menuGrid = dynamicMenuSection.querySelector('.menu-grid');

        let currentMenuType = 'regular'; // 'regular' or 'specials'
        let currentCategory = 'All';
        let currentTimeCategory = 'All Day'; // Example: 'Breakfast', 'Lunch', 'Dinner', 'All Day'

        // --- Time of Day Logic (Example) ---
        function updateTimeIndicator() {
            if (!timeIndicator) return;
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 11) currentTimeCategory = 'Breakfast';
            else if (hour >= 11 && hour < 16) currentTimeCategory = 'Lunch';
            else if (hour >= 16 && hour < 22) currentTimeCategory = 'Dinner';
            else currentTimeCategory = 'Night Snacks'; // Or 'All Day'
            
            // Update text if categories for time exist in menuData
            // For now, just display a general message as PRD didn't specify time-based categories
            timeIndicator.textContent = `Serving Now: ${currentTimeCategory} Menu`; 
        }

        // --- Toggle Logic ---
        function setupHomepageMenuToggle() {
            if (!toggleButtons.length || !toggleBackground) return;
            
            toggleButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const type = this.dataset.type; // Expect 'regular' or 'specials'
                    if (currentMenuType === type) return;

                    currentMenuType = type;
                    toggleButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');

                    // Move background
                    if (type === 'specials') {
                        toggleBackground.style.transform = 'translateX(100%)';
                    } else {
                        toggleBackground.style.transform = 'translateX(0%)';
                    }
                    renderHomepageMenuItems(); 
                });
            });
             // Set initial state
             const initialActive = dynamicMenuSection.querySelector(`.menu-toggle-btn[data-type='${currentMenuType}']`);
             if(initialActive) initialActive.classList.add('active');
              if (currentMenuType === 'specials') {
                  toggleBackground.style.transform = 'translateX(100%)';
              } else {
                  toggleBackground.style.transform = 'translateX(0%)';
              }
        }
        
        // --- Category Logic ---
        function renderHomepageCategories() {
            if (!categoryContainer) return;
            
            // Filter categories based on current menu type (regular/specials) AND time (optional)
            const relevantItems = menuData.filter(item => {
                 const matchesType = (currentMenuType === 'specials') ? item.isSpecial : !item.isSpecial; // Simplified: show only specials or only regular
                 // Add time logic here if needed: const matchesTime = ...;
                 return matchesType; // && matchesTime;
            });
            
            const categories = ['All', ...new Set(relevantItems.map(item => item.category))];
            
            categoryContainer.innerHTML = ''; // Clear existing
            categories.forEach(category => {
                const catElement = document.createElement('div');
                catElement.className = 'menu-category';
                catElement.textContent = category;
                catElement.dataset.category = category;
                if (category === currentCategory) {
                    catElement.classList.add('active');
                }
                catElement.addEventListener('click', () => {
                    currentCategory = category;
                    renderHomepageCategories(); // Update active state
                    renderHomepageMenuItems();
                });
                categoryContainer.appendChild(catElement);
            });
        }

        // --- Item Rendering Logic ---
        function renderHomepageMenuItems() {
            if (!menuGrid) return;

            // Fade out effect
            menuGrid.classList.add('fade');

            setTimeout(() => { // Allow fade out transition
                menuGrid.innerHTML = ''; // Clear existing items

                const itemsToDisplay = menuData.filter(item => {
                    const matchesType = (currentMenuType === 'specials') ? item.isSpecial : true; // Show all if regular, only specials if specials
                    const matchesCategory = currentCategory === 'All' || item.category === currentCategory;
                    // Add time logic here if needed
                    return matchesType && matchesCategory; // && matchesTime
                });
                
                if (itemsToDisplay.length === 0) {
                    menuGrid.innerHTML = '<p>No items available for this selection.</p>';
                } else {
                    itemsToDisplay.forEach(item => {
                        const card = document.createElement('div');
                        card.className = 'menu-item-card';
                        // Using the structure from homepage.html
                        card.innerHTML = `
                            <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}" class="menu-item-image"> 
                            <div class="menu-item-content">
                                <div class="menu-item-tags">
                                    <span class="menu-item-tag ${item.isVeg ? 'veg' : 'non-veg'}">${item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                                    ${item.isSpecial ? '<span class="menu-item-tag bestseller">Special</span>' : ''}
                                    <!-- Add more tags if needed from data -->
                                </div>
                                <div class="menu-item-name">${item.name}</div>
                                <p class="menu-item-desc">${item.description || 'Delicious item from our kitchen.'}</p> <!-- Add description field to menuData if desired -->
                                <div class="menu-item-actions">
                                    <span class="menu-item-price">₹${item.price.toFixed(2)}</span>
                                    <button class="add-to-cart-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                                        <i class="fas fa-shopping-cart"></i> Add
                                    </button>
                                    <!-- <button class="favorite-btn"><i class="far fa-heart"></i></button> -->
                                </div>
                            </div>
                        `;
                         // Re-attach event listener for the new add-to-cart button
                        const addToCartBtn = card.querySelector('.add-to-cart-btn');
                        if (addToCartBtn) {
                           attachAddToCartListener(addToCartBtn); // Use a helper function to avoid code duplication
                        }
                        menuGrid.appendChild(card);
                    });
                }
                // Fade in new items
                menuGrid.classList.remove('fade');
            }, 300); // Match CSS transition time
        }
        
        // Helper to attach listener (avoids duplicating cart logic)
        function attachAddToCartListener(button) {
             button.addEventListener('click', function() {
                // Assuming addToCart function exists globally from script.js
                 if (typeof addToCart === 'function') {
                    const item = {
                        id: this.dataset.id,
                        name: this.dataset.name,
                        price: parseFloat(this.dataset.price),
                        // image: this.closest('.menu-item-card').querySelector('.menu-item-image').src, // Get image source if needed
                        quantity: 1
                    };
                    addToCart(item);
                 } else {
                     console.error("addToCart function not found.");
                 }
            });
        }

        // --- Initial Setup ---
        updateTimeIndicator(); // Set initial time message
        setupHomepageMenuToggle();
        renderHomepageCategories();
        renderHomepageMenuItems();
        
        // Re-initialize cart buttons for items potentially rendered initially by HTML
        dynamicMenuSection.querySelectorAll('.add-to-cart-btn').forEach(attachAddToCartListener);

    }

    // Call the initializer for the dynamic menu
    initializeHomepageDynamicMenu();

    // --- END HOMEPAGE DYNAMIC MENU LOGIC ---

    // --- HOMEPAGE 2 MENU HIGHLIGHTS LOGIC ---
    function initializeHomepage2Highlights() {
        const highlightsSection = document.getElementById('menu-highlights');
        if (!highlightsSection) return; // Only run on homepage2

        // Check if menuData is loaded
        if (typeof menuData === 'undefined') {
            console.error('Homepage2 Highlights Error: menuData is not loaded.');
            highlightsSection.innerHTML = '<p>Error loading menu highlights.</p>';
            return;
        }

        const highlightsGrid = document.getElementById('highlights-grid');
        if (!highlightsGrid) return;

        // Select items for highlights (e.g., first 4-6 specials, fallback to first few items)
        let highlightItems = menuData.filter(item => item.isSpecial);
        if (highlightItems.length < 4) { // Ensure at least a few items
            const needed = 4 - highlightItems.length;
            const additionalItems = menuData.filter(item => !item.isSpecial).slice(0, needed);
             // Avoid duplicates 
             const existingIds = new Set(highlightItems.map(i => i.id));
             additionalItems.forEach(addItem => {
                 if (!existingIds.has(addItem.id)) {
                    highlightItems.push(addItem);
                    existingIds.add(addItem.id); // Add new ID to set
                 }
             });
        }
        highlightItems = highlightItems.slice(0, 6); // Limit to max 6 highlights

        // Render items
        highlightsGrid.innerHTML = ''; // Clear loading message
        if (highlightItems.length === 0) {
            highlightsGrid.innerHTML = '<p>No highlights available at the moment.</p>';
        } else {
            highlightItems.forEach(item => {
                const card = document.createElement('div');
                card.className = 'menu-item-card'; // Reuse card style from menu.css
                card.innerHTML = `
                    <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}" class="menu-item-image"> 
                    <div class="menu-item-content">
                         <div class="menu-item-tags">
                            <span class="menu-item-tag ${item.isVeg ? 'veg' : 'non-veg'}">${item.isVeg ? 'Veg' : 'Non-Veg'}</span>
                            ${item.isSpecial ? '<span class="menu-item-tag bestseller">Special</span>' : ''}
                         </div>
                        <div class="menu-item-name">${item.name}</div>
                        <p class="price" style="color: #f76b1c; font-weight: bold; margin-bottom: 1rem;">₹${item.price.toFixed(2)}</p> 
                        <div class="menu-item-actions">
                             <button class="add-to-cart-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                                <i class="fas fa-shopping-cart"></i> Add
                            </button>
                             <!-- Removed favorite button for highlights simplicity -->
                        </div>
                    </div>
                `;
                 // Re-attach event listener using the same helper
                const addToCartBtn = card.querySelector('.add-to-cart-btn');
                if (addToCartBtn) {
                   attachAddToCartListener(addToCartBtn); 
                }
                highlightsGrid.appendChild(card);
            });
        }
    }

    // Call initializer for homepage2 highlights
    initializeHomepage2Highlights();

    // --- END HOMEPAGE 2 MENU HIGHLIGHTS LOGIC ---

    // Helper function (declared once, used by both homepage menus)
     function attachAddToCartListener(button) {
        button.addEventListener('click', function() {
            // Ensure addToCart is available (it's defined later in the original script.js)
            if (typeof addToCart === 'function') {
                const item = {
                    id: this.dataset.id,
                    name: this.dataset.name,
                    price: parseFloat(this.dataset.price),
                    // image: this.closest('.menu-item-card').querySelector('.menu-item-image').src, // Could add image if cart needs it
                    quantity: 1
                };
                addToCart(item);
            } else {
                console.error("addToCart function not found or not accessible.");
            }
        });
    }

    // --- Testimonial Visibility Observer ---
    const testimonialObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a slight delay based on index for staggered effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150); // 150ms delay between items
                testimonialObserver.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% is visible

    const testimonials = document.querySelectorAll('.testimonial');
    testimonials.forEach(testimonial => {
        testimonialObserver.observe(testimonial);
    });
    // --- End Testimonial Visibility Observer ---

}); // End of DOMContentLoaded

// Restaurant Website Features

// Order Tracking System
function initializeOrderTracking() {
    const orderButtons = document.querySelectorAll('.order-btn');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const orderType = this.closest('.order-option').querySelector('h3').textContent;
            showOrderModal(orderType);
        });
    });
}

function showOrderModal(orderType) {
    // Create modal HTML
    const modalHTML = `
        <div class="order-modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${orderType} Order</h2>
                <form id="orderForm">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone</label>
                        <input type="tel" id="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="address">${orderType === 'Delivery' ? 'Delivery Address' : 'Pickup Time'}</label>
                        <input type="text" id="address" required>
                    </div>
                    <button type="submit" class="submit-btn">Place Order</button>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    const modalStyles = `
        <style>
            .order-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background: white;
                padding: 30px;
                border-radius: 20px;
                width: 90%;
                max-width: 500px;
                position: relative;
            }
            .close-modal {
                position: absolute;
                right: 20px;
                top: 20px;
                font-size: 24px;
                cursor: pointer;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
                color: #666;
            }
            .form-group input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .submit-btn {
                background: #f76b1c;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                cursor: pointer;
                width: 100%;
                font-size: 1.1rem;
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', modalStyles);
    
    // Add event listeners
    const modal = document.querySelector('.order-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const form = modal.querySelector('#orderForm');
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the order to your backend
        alert('Order placed successfully! We will contact you shortly.');
        modal.remove();
    });
}

// Offer Animations
function initializeOfferAnimations() {
    const offerCards = document.querySelectorAll('.offer-card');
    
    offerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Reservation System
function initializeReservationSystem() {
    const reservationBtn = document.querySelector('a[href="#reservation"]');
    
    if (reservationBtn) {
        reservationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showReservationModal();
        });
    }
}

function showReservationModal() {
    const modalHTML = `
        <div class="reservation-modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Book a Table</h2>
                <form id="reservationForm">
                    <div class="form-group">
                        <label for="resName">Name</label>
                        <input type="text" id="resName" required>
                    </div>
                    <div class="form-group">
                        <label for="resPhone">Phone</label>
                        <input type="tel" id="resPhone" required>
                    </div>
                    <div class="form-group">
                        <label for="resDate">Date</label>
                        <input type="date" id="resDate" required>
                    </div>
                    <div class="form-group">
                        <label for="resTime">Time</label>
                        <input type="time" id="resTime" required>
                    </div>
                    <div class="form-group">
                        <label for="resGuests">Number of Guests</label>
                        <input type="number" id="resGuests" min="1" max="10" required>
                    </div>
                    <button type="submit" class="submit-btn">Book Table</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.querySelector('.reservation-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const form = modal.querySelector('#reservationForm');
    
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the reservation to your backend
        alert('Table booked successfully! We will confirm your reservation shortly.');
        modal.remove();
    });
}

// Cart System
let cart = [];
let cartTotal = 0;

// Initialize cart
function initializeCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const closeCart = document.querySelector('.close-cart');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartSidebar = document.querySelector('.cart-sidebar');

    if (cartIcon && cartSidebar) {
        // Open cart
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close cart
        function closeCartSidebar() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (closeCart) {
            closeCart.addEventListener('click', closeCartSidebar);
        }
        if (cartOverlay) {
            cartOverlay.addEventListener('click', closeCartSidebar);
        }
    }
}

// Add item to cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }
    
    updateCart();
    showAddToCartAnimation();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Update cart UI
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const subtotalAmount = document.querySelector('.subtotal-amount');
    const taxAmount = document.querySelector('.tax-amount');
    const totalAmount = document.querySelector('.total-amount');
    
    if (cartCount) {
        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    if (cartItems) {
        // Update cart items
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                        <button class="quantity-btn plus">+</button>
                        <button class="remove-item">&times;</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    if (subtotalAmount && taxAmount && totalAmount) {
        // Update totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.05;
        const total = subtotal + tax;
        
        subtotalAmount.textContent = `₹${subtotal.toFixed(2)}`;
        taxAmount.textContent = `₹${tax.toFixed(2)}`;
        totalAmount.textContent = `₹${total.toFixed(2)}`;
    }
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const itemId = cartItem.dataset.id;
            const item = cart.find(item => item.id === itemId);
            
            if (this.classList.contains('plus')) {
                item.quantity = Math.min(item.quantity + 1, 10);
            } else if (this.classList.contains('minus')) {
                item.quantity = Math.max(item.quantity - 1, 1);
            }
            
            updateCart();
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const itemId = cartItem.dataset.id;
            removeFromCart(itemId);
        });
    });
}

// Show add to cart animation
function showAddToCartAnimation() {
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('bounce');
        setTimeout(() => {
            cartIcon.classList.remove('bounce');
        }, 300);
    }
}

// Sign In Modal Functionality
function initializeSignInModal() {
    const signInBtn = document.querySelector('.sign-in-btn');
    const signInModal = document.querySelector('.sign-in-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeModal = document.querySelector('.close-modal');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    if (signInBtn && signInModal) {
        // Open modal
        signInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            signInModal.classList.add('active');
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close modal
        function closeSignInModal() {
            signInModal.classList.remove('active');
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (closeModal) {
            closeModal.addEventListener('click', closeSignInModal);
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeSignInModal);
        }

        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding form
                authForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${tab}Form`) {
                        form.classList.add('active');
                    }
                });
            });
        });

        // Form submissions
        document.getElementById('signinForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            
            // Here you would typically send this to your backend
            console.log('Sign in:', { email, password });
            
            // For demo purposes, just close the modal
            closeSignInModal();
        });

        document.getElementById('signupForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const phone = document.getElementById('signup-phone').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Here you would typically send this to your backend
            console.log('Sign up:', { name, email, phone, password });
            
            // For demo purposes, just close the modal
            closeSignInModal();
        });
    }
}

// Order Buttons Functionality
function initializeOrderButtons() {
    const orderBtns = document.querySelectorAll('.order-btn');
    
    orderBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const signInModal = document.querySelector('.sign-in-modal');
            const modalOverlay = document.querySelector('.modal-overlay');
            
            if (signInModal && modalOverlay) {
                signInModal.classList.add('active');
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

// Offer Cards Functionality
function initializeOfferCards() {
    const offerCards = document.querySelectorAll('.offer-card');
    
    offerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Profile Dropdown Toggle Logic
const profileDropdowns = document.querySelectorAll('.profile-dropdown');

profileDropdowns.forEach(dropdown => {
    const button = dropdown.querySelector('.sign-in-btn.signed-in');
    const content = dropdown.querySelector('.profile-dropdown-content');

    if (button && content) {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent link navigation
            // Close other open dropdowns first
            profileDropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('show');
                }
            });
            // Toggle the current dropdown
            dropdown.classList.toggle('show');
        });
    }
});

// Close dropdown if clicked outside
document.addEventListener('click', (event) => {
    let clickedInsideDropdown = false;
    profileDropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target)) {
            clickedInsideDropdown = true;
        }
    });

    if (!clickedInsideDropdown) {
        profileDropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

// --- Existing Cart Logic ---
const cartIcon = document.querySelector('.cart-nav-link'); 