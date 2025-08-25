console.log('Admin orders JS loaded.');
// TODO: Add logic to fetch and display all orders for admin. 

const ordersApi = 'http://127.0.0.1:5000/api/admin/orders';

async function fetchOrders() {
    const res = await fetch(ordersApi);
    const orders = await res.json();
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = '';
    orders.forEach(order => {
        const items = order.items.map(item => `${item.food_name} (x${item.quantity})`).join(', ');
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.user_id}</td>
            <td>${new Date(order.order_date).toLocaleString()}</td>
            <td>${order.status}</td>
            <td>${items}</td>
            <td>${order.address || ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

window.onload = fetchOrders; 