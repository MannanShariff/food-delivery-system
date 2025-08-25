const apiBase = 'http://127.0.0.1:5000/api/admin/categories';

async function fetchCategories() {
    const res = await fetch(apiBase);
    const categories = await res.json();
    console.log('Fetched categories:', categories);
    const list = document.getElementById('category-list');
    list.innerHTML = '';
    categories.forEach(cat => {
        const li = document.createElement('li');
        li.textContent = cat.name;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'delete-category-btn';
        delBtn.onclick = async () => {
            await fetch(apiBase + '/' + cat.id, { method: 'DELETE' });
            fetchCategories();
        };
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

document.getElementById('add-category-form').onsubmit = async function(e) {
    e.preventDefault();
    const name = document.getElementById('category-name').value;
    await fetch(apiBase, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    document.getElementById('category-name').value = '';
    fetchCategories();
};

window.onload = fetchCategories; 