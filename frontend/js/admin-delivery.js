console.log('Admin delivery JS loaded.');
// TODO: Add logic to fetch, add, and update delivery details for admin. 

const deliveryApi = 'http://127.0.0.1:5000/api/admin/delivery';

async function fetchDeliveries() {
    const res = await fetch(deliveryApi);
    const deliveries = await res.json();
    const tbody = document.querySelector('#delivery-table tbody');
    tbody.innerHTML = '';
    deliveries.forEach(delivery => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${delivery.order_id}</td>
            <td>${delivery.address}</td>
            <td>${delivery.delivery_status}</td>
            <td><button class="edit-delivery-btn" data-order="${delivery.order_id}" data-address="${delivery.address}" data-status="${delivery.delivery_status}">Edit</button></td>
        `;
        tbody.appendChild(tr);
    });
    addEditListeners();
}

function addEditListeners() {
    document.querySelectorAll('.edit-delivery-btn').forEach(btn => {
        btn.onclick = function() {
            document.getElementById('order-id').value = btn.getAttribute('data-order');
            document.getElementById('delivery-address').value = btn.getAttribute('data-address');
            document.getElementById('delivery-status').value = btn.getAttribute('data-status');
        };
    });
}

document.getElementById('delivery-form').onsubmit = async function(e) {
    e.preventDefault();
    const order_id = document.getElementById('order-id').value;
    const address = document.getElementById('delivery-address').value;
    const delivery_status = document.getElementById('delivery-status').value;
    await fetch(deliveryApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id, address, delivery_status })
    });
    document.getElementById('delivery-form').reset();
    fetchDeliveries();
};

window.onload = fetchDeliveries; 