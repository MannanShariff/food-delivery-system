console.log('customer-foods.js loaded');

const foodsApi = 'http://127.0.0.1:5000/api/foods';
const categoriesApi = 'http://127.0.0.1:5000/api/admin/categories';
const cartApi = 'http://127.0.0.1:5000/api/cart';

async function fetchCategories() {
    console.log('fetchCategories called');
    const res = await fetch(categoriesApi);
    const categories = await res.json();
    const select = document.getElementById('filter-category');
    select.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

async function fetchFoods(query = '', category = '') {
    let url = foodsApi;
    const params = [];
    if (query) params.push(`search=${encodeURIComponent(query)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (params.length) url += '?' + params.join('&');
    const res = await fetch(url);
    const foods = await res.json();
    const tbody = document.querySelector('#foods-table tbody');
    tbody.innerHTML = '';
    foods.forEach(food => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${food.name}</td>
            <td>${food.category_name || ''}</td>
            <td>${food.price}</td>
            <td>${food.description || ''}</td>
            <td><button class="add-to-cart-btn" data-id="${food.id}">Add to Cart</button></td>
        `;
        tbody.appendChild(tr);
    });
    addCartListeners();
}

function addCartListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.onclick = async function() {
            const food_id = this.getAttribute('data-id');
            // For demo, use user_id=1. In real app, get from session/login.
            const user_id = 1;
            await fetch(cartApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id, food_id, quantity: 1 })
            });
            alert('Added to cart!');
        };
    });
}

document.getElementById('search-btn').onclick = function() {
    const query = document.getElementById('search-food').value;
    const category = document.getElementById('filter-category').value;
    fetchFoods(query, category);
};

document.getElementById('filter-category').onchange = function() {
    const query = document.getElementById('search-food').value;
    const category = document.getElementById('filter-category').value;
    fetchFoods(query, category);
};

window.addEventListener('load', async function() {
    console.log('window load event in customer-foods.js');
    await fetchCategories();
    fetchFoods();
}); 