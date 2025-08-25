const ordersApi = 'http://127.0.0.1:5000/api/orders';

async function fetchOrders() {
    // For demo, use user_id=1. In real app, get from session/login.
    const user_id = 1;
    const res = await fetch(`${ordersApi}?user_id=${user_id}`);
    const orders = await res.json();
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = '';
    orders.forEach(order => {
        const items = order.items.map(item => `${item.food_name} (x${item.quantity})`).join(', ');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${new Date(order.order_date).toLocaleString()}</td>
            <td>${order.status}</td>
            <td>${items}</td>
            <td>${order.address || ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

window.onload = fetchOrders; 