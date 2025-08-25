console.log('Customer delivery JS loaded.');
// TODO: Add logic to fetch and display delivery details for the customer. 

const deliveryApi = 'http://127.0.0.1:5000/api/delivery';

async function fetchDeliveryDetails() {
    // For demo, use user_id=1. In real app, get from session/login.
    const user_id = 1;
    const res = await fetch(`${deliveryApi}?user_id=${user_id}`);
    const deliveries = await res.json();
    const tbody = document.querySelector('#delivery-table tbody');
    tbody.innerHTML = '';
    deliveries.forEach(delivery => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${delivery.order_id}</td>
            <td>${delivery.address}</td>
            <td>${delivery.delivery_status}</td>
        `;
        tbody.appendChild(tr);
    });
}

window.onload = fetchDeliveryDetails; 