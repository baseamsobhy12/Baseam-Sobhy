// Sample product data (in a real application, this would come from a database)
const products = {
    nike: [
        { id: 'n1', name: 'Air Max 270', price: 150, desc: 'Comfortable sports shoe with Nike Air technology for all-day wear.' },
        { id: 'n2', name: 'Air Force 1', price: 100, desc: 'Classic design that fits every style and occasion.' },
        { id: 'n3', name: 'Nike Revolution 6', price: 85, desc: 'Lightweight running shoe with excellent foot support.' }
    ],
    adidas: [
        { id: 'a1', name: 'Ultra Boost', price: 180, desc: 'Superior comfort and advanced boost technology for runners.' },
        { id: 'a2', name: 'Superstar', price: 90, desc: 'Timeless Adidas classic for everyday outfits.' },
        { id: 'a3', name: 'Adidas Gazelle', price: 110, desc: 'Sleek and lightweight design for any occasion.' }
    ],
    active: [
        { id: 'ac1', name: 'Active Sneaker', price: 80, desc: 'Practical and lightweight for daily use.' },
        { id: 'ac2', name: 'Active Runner', price: 60, desc: 'Affordable sports shoe for running and walking.' }
    ],
    puma: [
        { id: 'p1', name: 'Puma Smash', price: 95, desc: 'Stylish and durable, perfect for casual wear.' },
        { id: 'p2', name: 'Puma Flyer Runner', price: 105, desc: 'Lightweight and responsive runner for daily training.' }
    ],
    reebok: [
        { id: 'r1', name: 'Reebok Classic', price: 85, desc: 'Classic, practical, and comfortable sneaker.' },
        { id: 'r2', name: 'Reebok Nano', price: 120, desc: 'Designed for intense workouts and training.' }
    ],
    "new-balance": [
        { id: 'nb1', name: 'New Balance 574', price: 130, desc: 'Comfort and perfect support for running and walking.' },
        { id: 'nb2', name: 'New Balance Fresh Foam', price: 140, desc: 'Modern foam technology for all-day comfort.' }
    ],
    converse: [
        { id: 'c1', name: 'Converse Chuck Taylor', price: 75, desc: 'Classic design suitable for all ages.' },
        { id: 'c2', name: 'Converse All Star', price: 80, desc: 'Iconic sneaker for casual outfits.' }
    ],
    vans: [
        { id: 'v1', name: 'Vans Old Skool', price: 90, desc: 'Comfortable and stylish for skate and casual wear.' },
        { id: 'v2', name: 'Vans Authentic', price: 85, desc: 'Simple and lightweight for everyday use.' }
    ],
    skechers: [
        { id: 's1', name: 'Skechers Go Walk', price: 70, desc: 'Superior comfort for daily walking.' },
        { id: 's2', name: 'Skechers Flex Advantage', price: 95, desc: 'Flexible and comfortable sports shoe.' }
    ],
    under: [
        { id: 'u1', name: 'Under Armour Charged', price: 110, desc: 'High-performance sports shoe with advanced technology.' },
        { id: 'u2', name: 'Under Armour Assert', price: 100, desc: 'Comfort and support for your workouts.' }
    ],
    fila: [
        { id: 'f1', name: 'Fila Disruptor', price: 105, desc: 'Trendy and bold design for fashion lovers.' },
        { id: 'f2', name: 'Fila Ray', price: 90, desc: 'Comfortable and stylish for everyday wear.' }
    ]
};

// Special offers data
const specialOffers = [
    { id: 'so1', name: 'Nike Air Max 270', originalPrice: 150, salePrice: 120, discount: '20%', desc: 'Special discount on the popular Nike Air Max 270.' },
    { id: 'so2', name: 'Adidas Ultra Boost', originalPrice: 180, salePrice: 135, discount: '25%', desc: 'Top comfort and technology at a great price.' },
    { id: 'so3', name: 'Puma Smash', originalPrice: 95, salePrice: 75, discount: '21%', desc: 'Exclusive offer on the stylish Puma Smash.' },
    { id: 'so4', name: 'Skechers Go Walk', originalPrice: 70, salePrice: 55, discount: '21%', desc: 'Superior comfort for less with Skechers Go Walk.' },
    { id: 'so5', name: 'Fila Disruptor', originalPrice: 105, salePrice: 85, discount: '19%', desc: 'Fila Disruptor now at a special price.' }
];

// Function to create product cards
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="product-price">$${product.price}</p>
                <p class="product-desc">${product.desc}</p>
                ${product.onSale ? '<span class="sale-badge">Sale</span>' : ''}
            </div>
        </div>
    `;
}

// Function to create special offer cards
function createSpecialOfferCard(offer) {
    return `
        <div class="product-card special-offer">
            <div class="product-info">
                <h4>${offer.name}</h4>
                <p class="product-price">
                    <span class="original-price">$${offer.originalPrice}</span>
                    <span class="sale-price">$${offer.salePrice}</span>
                    <span class="discount">${offer.discount} OFF</span>
                </p>
                <p class="product-desc">${offer.desc}</p>
            </div>
        </div>
    `;
}

function fadeInGrid(grid) {
    if (grid) {
        grid.style.opacity = 0;
        grid.style.transition = "opacity 0.8s";
        setTimeout(() => { grid.style.opacity = 1; }, 100);
    }
}

// Function to load products for each brand
function loadProducts() {
    for (const [brand, brandProducts] of Object.entries(products)) {
        const productGrid = document.querySelector(`#${brand} .product-grid`);
        if (productGrid) {
            productGrid.innerHTML = brandProducts.map(createProductCard).join('');
            fadeInGrid(productGrid);
        }
    }
}

// Function to load special offers
function loadSpecialOffers() {
    const offersGrid = document.querySelector('.offers-grid');
    if (offersGrid) {
        offersGrid.innerHTML = specialOffers.map(createSpecialOfferCard).join('');
        fadeInGrid(offersGrid);
    }
}

// Function to handle suggestion form submission
function handleSuggestions(event) {
    event.preventDefault();
    const brand = document.getElementById('preferred-brand').value;
    const priceRange = document.getElementById('price-range').value;
    
    // Filter products based on selection
    const suggestions = products[brand]?.filter(product => {
        switch(priceRange) {
            case 'budget': return product.price < 50;
            case 'mid': return product.price >= 50 && product.price < 100;
            case 'premium': return product.price >= 100 && product.price < 200;
            case 'luxury': return product.price >= 200;
            default: return true;
        }
    }) || [];

    // Display suggestions
    const suggestionsResult = document.getElementById('suggestions-result');
    if (suggestions.length > 0) {
        suggestionsResult.innerHTML = `
            <h3>Your Personalized Suggestions</h3>
            <div class="product-grid">
                ${suggestions.map(createProductCard).join('')}
            </div>
        `;
    } else {
        suggestionsResult.innerHTML = '<p>No suggestions found for your criteria. Please try different options.</p>';
    }
}

// debounce helper
function debounce(fn, delay = 300) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), delay);
    };
}

// escape regex
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// render results with highlight
function renderSearchResults(found, query) {
    const resultsDiv = document.getElementById('search-results');
    if (!query) {
        resultsDiv.innerHTML = '';
        return;
    }
    if (found.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align:center;color:#FF6B00;">No results found for your search.</p>';
        return;
    }
    const q = escapeRegex(query.trim());
    const re = new RegExp(`(${q})`, 'ig');
    resultsDiv.innerHTML = `
        <div class="product-grid">
            ${found.map(product => {
                const name = product.name.replace(re, '<mark class="search-hit">$1</mark>');
                const desc = (product.desc || '').replace(re, '<mark class="search-hit">$1</mark>');
                return `
                    <div class="product-card">
                        <div class="product-info">
                            <h4>${name}</h4>
                            <p class="product-price">$${product.price}</p>
                            <p class="product-desc">${desc}</p>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// modified handleSearch to accept a query (used by submit and live input)
function handleSearch(eventOrQuery) {
    if (eventOrQuery && eventOrQuery.preventDefault) eventOrQuery.preventDefault();
    const query = (typeof eventOrQuery === 'string') ? eventOrQuery : document.getElementById('search-input').value.trim();
    const resultsDiv = document.getElementById('search-results');
    if (!query) {
        resultsDiv.innerHTML = '<p style="text-align:center;color:#FF6B00;">Please type the name of the sneaker or brand to search.</p>';
        return;
    }
    let found = [];
    for (const [brand, brandProducts] of Object.entries(products)) {
        found = found.concat(
            brandProducts.filter(
                p => p.name.toLowerCase().includes(query.toLowerCase()) ||
                     brand.toLowerCase().includes(query.toLowerCase()) ||
                     (p.desc && p.desc.toLowerCase().includes(query.toLowerCase()))
            )
        );
    }
    renderSearchResults(found, query);
}

let sentCode = null;

function showLoginPage() {
    document.getElementById('login-page').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hideLoginPage() {
    document.getElementById('login-page').style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('auth-form').reset();
    document.getElementById('auth-message').textContent = '';
    document.getElementById('code-group').style.display = 'none';
    document.getElementById('auth-submit-btn').style.display = 'none';
}

// -------------------- User account helpers (added) --------------------
function loadUsers() {
    try {
        return JSON.parse(localStorage.getItem('snackers_users') || '{}');
    } catch (e) {
        return {};
    }
}
function saveUsers(users) {
    localStorage.setItem('snackers_users', JSON.stringify(users));
}
function getUser(email) {
    if (!email) return null;
    const users = loadUsers();
    return users[email.toLowerCase()] || null;
}
function setUser(email, data) {
    const users = loadUsers();
    users[email.toLowerCase()] = Object.assign(users[email.toLowerCase()] || {}, data);
    saveUsers(users);
}
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function sendCodeToEmail(email, code, purpose = 'Verification') {
    // opens user's mail client with prefilled message (client-side simulation)
    const subject = encodeURIComponent(`Snackers ${purpose} Code`);
    const body = encodeURIComponent(`Your Snackers ${purpose} code is: ${code}\n\nThis code is valid for 10 minutes.`);
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
}
// store code with expiry (10 minutes)
function storeCodeForEmail(email, code) {
    const expiry = Date.now() + 10 * 60 * 1000;
    setUser(email, { lastCode: code, lastCodeExpiry: expiry });
}
// create account (store password) and send code
function createAccount(email, password) {
    if (!email || !password) return { ok: false, msg: 'Email and password required.' };
    const existing = getUser(email);
    if (existing) return { ok: false, msg: 'Account already exists for this email.' };
    setUser(email, { password: password, createdAt: Date.now() });
    const code = generateCode();
    storeCodeForEmail(email, code);
    sendCodeToEmail(email, code, 'Account Verification');
    return { ok: true, msg: 'Account created. Verification code sent to your email (opens mail client).' };
}
// send verification/reset code for existing email
function sendCodeForExistingEmail(email, purpose = 'Verification') {
    if (!email) return { ok: false, msg: 'Enter your email first.' };
    const user = getUser(email);
    if (!user) return { ok: false, msg: 'No account found for this email.' };
    const code = generateCode();
    storeCodeForEmail(email, code);
    sendCodeToEmail(email, code, purpose);
    return { ok: true, msg: `${purpose} code sent (opens mail client).` };
}
function verifyCodeForEmail(email, code) {
    const user = getUser(email);
    if (!user || !user.lastCode) return false;
    if (user.lastCode !== code) return false;
    if (Date.now() > (user.lastCodeExpiry || 0)) return false;
    // mark verified and remove code
    setUser(email, { verified: true, lastCode: null, lastCodeExpiry: null });
    return true;
}
// login: either by password match or by code
function attemptLogin(email, password, code) {
    const user = getUser(email);
    if (!user) return { ok: false, msg: 'No account for this email.' };
    if (code) {
        if (verifyCodeForEmail(email, code)) {
            localStorage.setItem('snackers_current', email.toLowerCase());
            return { ok: true, msg: 'Logged in with code.' };
        } else {
            return { ok: false, msg: 'Invalid or expired code.' };
        }
    }
    if (password && user.password && password === user.password) {
        localStorage.setItem('snackers_current', email.toLowerCase());
        return { ok: true, msg: 'Logged in with password.' };
    }
    return { ok: false, msg: 'Incorrect password or missing code.' };
}

// -------------------- Profile helpers (added) --------------------
function loadProfiles() {
    try { return JSON.parse(localStorage.getItem('snackers_profiles') || '{}'); } catch (e) { return {}; }
}
function saveProfiles(profiles) {
    localStorage.setItem('snackers_profiles', JSON.stringify(profiles));
}
function getProfile(email) {
    if (!email) return null;
    const profiles = loadProfiles();
    return profiles[email.toLowerCase()] || null;
}

// update createProfileIfMissing to include phone/bio/avatar
function createProfileIfMissing(email) {
    const key = email.toLowerCase();
    const profiles = loadProfiles();
    if (!profiles[key]) {
        const displayName = (email.split('@')[0] || '').replace(/[^a-z0-9\-_.]/ig,'').slice(0,20) || 'User';
        profiles[key] = { email, displayName, phone: '', bio: '', avatar: '', createdAt: new Date().toISOString() };
        saveProfiles(profiles);
    }
    return profiles[key];
}
function setProfile(email, data) {
    const profiles = loadProfiles();
    profiles[email.toLowerCase()] = Object.assign(profiles[email.toLowerCase()] || {}, data);
    saveProfiles(profiles);
}

// show profile modal (enhanced) - replace previous implementation
function showProfileModal(email) {
    const modal = document.getElementById('profile-modal');
    const emailInput = document.getElementById('profile-email');
    const nameInput = document.getElementById('profile-name');
    const phoneInput = document.getElementById('profile-phone');
    const bioInput = document.getElementById('profile-bio');
    const avatarImg = document.getElementById('profile-avatar-img');
    const avatarInput = document.getElementById('profile-avatar-input');
    const createdDiv = document.getElementById('profile-created');
    const msgDiv = document.getElementById('profile-msg');
    const removeBtn = document.getElementById('profile-remove-avatar');

    const profile = getProfile(email) || createProfileIfMissing(email);
    if (!modal) return;
    emailInput.value = profile.email;
    nameInput.value = profile.displayName || '';
    phoneInput.value = profile.phone || '';
    bioInput.value = profile.bio || '';
    createdDiv.textContent = 'Member since: ' + new Date(profile.createdAt).toLocaleString();
    msgDiv.textContent = '';

    // avatar preview or placeholder
    const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect fill='%23111' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='36' fill='%23FF6B00'>${(profile.displayName||'U')[0].toUpperCase()}</text></svg>`);
    avatarImg.src = profile.avatar || placeholder;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // handle upload
    avatarInput.onchange = async function(e) {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        try {
            const dataUrl = await readFileAsDataURL(f);
            // optional: limit size by dataURL length (~ > 100KB maybe large) - skip here
            avatarImg.src = dataUrl;
            // temporarily store on element dataset
            avatarImg.dataset.pending = dataUrl;
            msgDiv.textContent = 'Image ready. Save to apply.';
            msgDiv.style.color = '#FF9800';
        } catch (err) {
            msgDiv.textContent = 'Failed to read image.';
            msgDiv.style.color = '#FF6B00';
        }
    };

    // remove avatar
    removeBtn.onclick = function() {
        delete avatarImg.dataset.pending;
        avatarImg.src = placeholder;
        msgDiv.textContent = 'Avatar removed (save to apply).';
        msgDiv.style.color = '#FF9800';
    };

    // save handler
    document.getElementById('profile-save').onclick = function() {
        const newName = nameInput.value.trim() || profile.displayName;
        const newPhone = phoneInput.value.trim();
        const newBio = bioInput.value.trim();
        const newAvatar = avatarImg.dataset.pending !== undefined ? avatarImg.dataset.pending : (profile.avatar || '');
        saveProfile(email, { displayName: newName, phone: newPhone, bio: newBio, avatar: newAvatar });
        // clear pending
        delete avatarImg.dataset.pending;
        msgDiv.style.color = '#4caf50';
        msgDiv.textContent = 'Profile saved.';
        updateAuthUI();
    };

    // logout handler
    document.getElementById('profile-logout').onclick = function() {
        localStorage.removeItem('snackers_current');
        modal.style.display = 'none';
        document.body.style.overflow = '';
        updateAuthUI();
    };

    // close
    document.getElementById('close-profile').onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };
}

// render small profile section on main page
function renderProfileSection() {
    const email = localStorage.getItem('snackers_current');
    const section = document.getElementById('profile-section');
    if (!section) return;
    if (!email) {
        section.style.display = 'none';
        return;
    }
    const profile = getProfile(email) || createProfileIfMissing(email);
    const avatarEl = document.getElementById('profile-card-avatar');
    const nameEl = document.getElementById('profile-card-name');
    const bioEl = document.getElementById('profile-card-bio');
    const logoutBtn = document.getElementById('profile-card-logout');
    const editLink = document.getElementById('profile-card-edit');

    const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect fill='%23111' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='36' fill='%23FF6B00'>${(profile.displayName||'U')[0].toUpperCase()}</text></svg>`);
    if (avatarEl) avatarEl.src = profile.avatar || placeholder;
    if (nameEl) nameEl.textContent = profile.displayName || profile.email;
    if (bioEl) bioEl.textContent = profile.bio || '';

    if (editLink) editLink.href = 'profile.html';
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            localStorage.removeItem('snackers_current');
            updateAuthUI();
            renderProfileSection();
        };
    }

    section.style.display = '';
}

// call renderProfileSection when UI updates
// ensure updateAuthUI calls renderProfileSection at end
function updateAuthUI() {
    const email = localStorage.getItem('snackers_current');
    const userInfo = document.getElementById('user-info');
    const profileDisplay = document.getElementById('profile-display');
    const loginBtn = document.getElementById('login-btn');

    if (email) {
        const profile = getProfile(email) || createProfileIfMissing(email);
        const avatarData = profile.avatar || ('data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect fill='%23111' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='48' fill='%23FF6B00'>${(profile.displayName||'U')[0].toUpperCase()}</text></svg>`));

        // small header slot kept but hidden visually
        if (userInfo) {
            userInfo.innerHTML = `<img class="header-avatar" src="${avatarData}" alt="avatar">`;
            userInfo.style.display = 'none';
            userInfo.onclick = () => window.location.href = 'profile.html';
        }

        // big visible avatar outside header: open profile page
        if (profileDisplay) {
            profileDisplay.style.backgroundImage = `url("${avatarData}")`;
            profileDisplay.style.display = '';
            profileDisplay.onclick = () => { window.location.href = 'profile.html'; };
            profileDisplay.setAttribute('aria-hidden', 'false');
        }

        if (loginBtn) {
            loginBtn.textContent = 'Logout';
            loginBtn.onclick = () => {
                localStorage.removeItem('snackers_current');
                if (profileDisplay) { profileDisplay.style.display = 'none'; profileDisplay.onclick = null; }
                updateAuthUI();
            };
        }
    } else {
        if (userInfo) { userInfo.textContent = ''; userInfo.style.display = 'none'; userInfo.onclick = null; }
        if (profileDisplay) { profileDisplay.style.display = 'none'; profileDisplay.onclick = null; profileDisplay.setAttribute('aria-hidden', 'true'); }
        if (loginBtn) { loginBtn.textContent = 'Login / Register'; loginBtn.onclick = showLoginPage; }
    }

    // render profile section on main page
    renderProfileSection();
}

// -------------------- Integrate profile creation on login (patch) --------------------

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadSpecialOffers();
    
    // Set up form submission handler
    const suggestionForm = document.getElementById('suggestion-form');
    if (suggestionForm) {
        suggestionForm.addEventListener('submit', handleSuggestions);
    }

    // live input with debounce (search as user types)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const debounced = debounce(() => handleSearch(searchInput.value), 300);
        searchInput.addEventListener('input', debounced);

        // Escape clears input and results
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                renderSearchResults([], '');
            }
        });
    }

    // Login page modal handlers (use the new account functions)
    const loginBtn = document.getElementById('login-btn');
    const backBtn = document.getElementById('back-to-home');
    const sendCodeBtn = document.getElementById('send-code-btn');
    const forgotLink = document.getElementById('forgot-password-link');
    const createLink = document.getElementById('create-account-link');
    const authForm = document.getElementById('auth-form');
    const authMessage = document.getElementById('auth-message');

    if (loginBtn) loginBtn.onclick = showLoginPage;
    if (backBtn) backBtn.onclick = hideLoginPage;

    if (sendCodeBtn) {
        sendCodeBtn.onclick = function() {
            const email = document.getElementById('auth-email').value.trim();
            const password = document.getElementById('auth-password').value.trim();
            if (!email) {
                authMessage.style.color = "#FF6B00";
                authMessage.textContent = "Please enter your email first.";
                return;
            }
            // If user exists, send code for login; otherwise suggest creating account
            const user = getUser(email);
            if (user) {
                const res = sendCodeForExistingEmail(email, 'Login Verification');
                authMessage.style.color = res.ok ? "#FF9800" : "#FF6B00";
                authMessage.textContent = res.msg;
                document.getElementById('code-group').style.display = '';
                document.getElementById('auth-submit-btn').style.display = '';
            } else {
                authMessage.style.color = "#FF6B00";
                authMessage.textContent = "No account found. Click 'Create account' to register this email.";
            }
        };
    }

    if (forgotLink) {
        forgotLink.onclick = function(e) {
            e.preventDefault();
            const email = document.getElementById('auth-email').value.trim();
            if (!email) {
                authMessage.style.color = "#FF6B00";
                authMessage.textContent = "Enter your registered email to receive reset code.";
                return;
            }
            const res = sendCodeForExistingEmail(email, 'Password Reset');
            authMessage.style.color = res.ok ? "#FF9800" : "#FF6B00";
            authMessage.textContent = res.msg;
            if (res.ok) {
                document.getElementById('code-group').style.display = '';
                document.getElementById('auth-submit-btn').style.display = '';
            }
        };
    }

    if (createLink) {
        createLink.onclick = function(e) {
            e.preventDefault();
            const email = document.getElementById('auth-email').value.trim();
            const password = document.getElementById('auth-password').value.trim();
            if (!email || !password) {
                authMessage.style.color = "#FF6B00";
                authMessage.textContent = "Enter email and password to create an account.";
                return;
            }
            const res = createAccount(email, password);
            authMessage.style.color = res.ok ? "#FF9800" : "#FF6B00";
            authMessage.textContent = res.msg;
            if (res.ok) {
                document.getElementById('code-group').style.display = '';
                document.getElementById('auth-submit-btn').style.display = '';
            }
        };
    }

    // ensure auth UI reflects stored session
    updateAuthUI();

    // replace auth form handler to create profile on success (modify existing handler)
    if (authForm) {
        authForm.onsubmit = function(e) {
            e.preventDefault();
            const email = document.getElementById('auth-email').value.trim();
            const password = document.getElementById('auth-password').value.trim();
            const code = document.getElementById('auth-code').value.trim();
            const res = attemptLogin(email, password, code);
            if (res.ok) {
                // create profile if missing and update UI
                createProfileIfMissing(email);
                authMessage.style.color = "#4caf50";
                authMessage.textContent = "Email verified! You are now logged in.";
                updateAuthUI();
                setTimeout(() => {
                    hideLoginPage();
                }, 900);
            } else {
                authMessage.style.color = "#FF6B00";
                authMessage.textContent = res.msg;
            }
        };
    }
});
