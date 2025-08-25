const foodsApi = 'http://127.0.0.1:5000/api/admin/foods';
const categoriesApi = 'http://127.0.0.1:5000/api/admin/categories';

async function fetchCategories() {
    const res = await fetch(categoriesApi);
    const categories = await res.json();
    const select = document.getElementById('food-category');
    select.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

async function fetchFoods() {
    const res = await fetch(foodsApi);
    const foods = await res.json();
    const tbody = document.querySelector('#foods-table tbody');
    tbody.innerHTML = '';
    foods.forEach(food => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="text" value="${food.name}" data-id="${food.id}" class="edit-name" /></td>
            <td>${food.category_name || ''}</td>
            <td><input type="number" value="${food.price}" data-id="${food.id}" class="edit-price" step="0.01" /></td>
            <td><input type="text" value="${food.description || ''}" data-id="${food.id}" class="edit-description" /></td>
            <td>
                <button class="update-food-btn" data-id="${food.id}">Update</button>
                <button class="delete-food-btn" data-id="${food.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    addFoodTableListeners();
}

function addFoodTableListeners() {
    document.querySelectorAll('.delete-food-btn').forEach(btn => {
        btn.onclick = async function() {
            const id = this.getAttribute('data-id');
            await fetch(`${foodsApi}/${id}`, { method: 'DELETE' });
            fetchFoods();
        };
    });
    document.querySelectorAll('.update-food-btn').forEach(btn => {
        btn.onclick = async function() {
            const id = this.getAttribute('data-id');
            const row = btn.closest('tr');
            const name = row.querySelector('.edit-name').value;
            const price = row.querySelector('.edit-price').value;
            const description = row.querySelector('.edit-description').value;
            // For simplicity, category is not editable inline
            await fetch(`${foodsApi}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price, description })
            });
            fetchFoods();
        };
    });
}

document.getElementById('add-food-form').onsubmit = async function(e) {
    e.preventDefault();
    const name = document.getElementById('food-name').value;
    const category_id = document.getElementById('food-category').value;
    const price = document.getElementById('food-price').value;
    const description = document.getElementById('food-description').value;
    await fetch(foodsApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category_id, price, description })
    });
    document.getElementById('add-food-form').reset();
    fetchFoods();
};

window.onload = async function() {
    await fetchCategories();
    fetchFoods();
}; 