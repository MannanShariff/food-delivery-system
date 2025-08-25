const cartApi = 'http://127.0.0.1:5000/api/cart';
const foodsApi = 'http://127.0.0.1:5000/api/foods';
const placeOrderApi = 'http://127.0.0.1:5000/api/orders';

async function fetchCart() {
    // For demo, use user_id=1. In real app, get from session/login.
    const user_id = 1;
    const res = await fetch(`${cartApi}?user_id=${user_id}`);
    const cart = await res.json();
    const tbody = document.querySelector('#cart-table tbody');
    tbody.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const tr = document.createElement('tr');
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        tr.innerHTML = `
            <td>${item.food_name}</td>
            <td>${item.category_name || ''}</td>
            <td>${item.price}</td>
            <td>${item.quantity}</td>
            <td>${itemTotal.toFixed(2)}</td>
            <td><button class="remove-cart-btn" data-id="${item.id}">Remove</button></td>
        `;
        tbody.appendChild(tr);
    });
    document.getElementById('cart-total').textContent = `Total: ₹${total.toFixed(2)}`;
    addRemoveListeners();
    addPlaceOrderButton(cart.length > 0);
}

function addRemoveListeners() {
    document.querySelectorAll('.remove-cart-btn').forEach(btn => {
        btn.onclick = async function() {
            const id = this.getAttribute('data-id');
            await fetch(`${cartApi}/${id}`, { method: 'DELETE' });
            fetchCart();
        };
    });
}

function addPlaceOrderButton(show) {
    let btn = document.getElementById('place-order-btn');
    if (!btn && show) {
        btn = document.createElement('button');
        btn.id = 'place-order-btn';
        btn.textContent = 'Place Order';
        btn.style.marginTop = '20px';
        btn.onclick = async function() {
            const user_id = 1;
            const address = document.getElementById('order-address').value;
            if (!address) {
                alert('Please enter a delivery address.');
                return;
            }
            const res = await fetch(placeOrderApi, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id, address })
            });
            const data = await res.json();
            alert(data.message);
            fetchCart();
        };
        document.querySelector('.cart-section').appendChild(btn);
    } else if (btn && !show) {
        btn.remove();
    }
}

window.onload = fetchCart; 