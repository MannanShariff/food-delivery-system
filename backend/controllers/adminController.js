const connection = require('../database');

exports.addCategory = (req, res) => {
    const { name } = req.body;
    console.log('Add Category called with:', name);
    if (!name) return res.status(400).json({ message: 'Category name is required.' });
    connection.query('INSERT INTO Categories (name) VALUES (?)', [name], (err, result) => {
        if (err) {
            console.error('DB Error:', err);
            return res.status(500).json({ message: 'Database error.' });
        }
        console.log('Insert result:', result);
        res.json({ message: 'Category added successfully.' });
    });
};
exports.deleteCategory = (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM Categories WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json({ message: 'Category deleted successfully.' });
    });
};
exports.viewCategories = (req, res) => {
    connection.query('SELECT * FROM Categories', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json(results);
    });
};
exports.addFood = (req, res) => {
    const { name, category_id, price, description } = req.body;
    if (!name || !category_id || !price) return res.status(400).json({ message: 'All fields are required.' });
    connection.query('INSERT INTO Foods (name, category_id, price, description) VALUES (?, ?, ?, ?)', [name, category_id, price, description], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json({ message: 'Food added successfully.' });
    });
};
exports.updateFood = (req, res) => {
    const id = req.params.id;
    const { name, category_id, price, description } = req.body;
    connection.query('UPDATE Foods SET name=?, category_id=?, price=?, description=? WHERE id=?', [name, category_id, price, description, id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json({ message: 'Food updated successfully.' });
    });
};
exports.deleteFood = (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM Foods WHERE id=?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json({ message: 'Food deleted successfully.' });
    });
};
exports.viewFoods = (req, res) => {
    connection.query('SELECT Foods.*, Categories.name AS category_name FROM Foods LEFT JOIN Categories ON Foods.category_id = Categories.id', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json(results);
    });
};
exports.searchFoods = (req, res) => res.send('Search Foods');
exports.viewAllOrders = (req, res) => {
    connection.query('SELECT * FROM Orders ORDER BY order_date DESC', (err, orders) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (orders.length === 0) return res.json([]);
        const orderIds = orders.map(o => o.id);
        connection.query('SELECT OrderItems.*, Foods.name AS food_name FROM OrderItems JOIN Foods ON OrderItems.food_id = Foods.id WHERE order_id IN (?)', [orderIds], (err2, items) => {
            if (err2) return res.status(500).json({ message: 'Database error.' });
            // Group items by order_id
            const itemsByOrder = {};
            items.forEach(item => {
                if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
                itemsByOrder[item.order_id].push({ food_name: item.food_name, quantity: item.quantity });
            });
            // Attach items to orders
            const result = orders.map(order => ({
                ...order,
                items: itemsByOrder[order.id] || []
            }));
            res.json(result);
        });
    });
};
exports.addDeliveryDetails = (req, res) => {
    const { order_id, address, delivery_status } = req.body;
    if (!order_id || !address || !delivery_status) return res.status(400).json({ message: 'All fields are required.' });
    // Upsert delivery details
    connection.query('SELECT * FROM DeliveryDetails WHERE order_id=?', [order_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (results.length > 0) {
            // Update
            connection.query('UPDATE DeliveryDetails SET address=?, delivery_status=? WHERE order_id=?', [address, delivery_status, order_id], (err2) => {
                if (err2) return res.status(500).json({ message: 'Database error.' });
                res.json({ message: 'Delivery details updated.' });
            });
        } else {
            // Insert
            connection.query('INSERT INTO DeliveryDetails (order_id, address, delivery_status) VALUES (?, ?, ?)', [order_id, address, delivery_status], (err2) => {
                if (err2) return res.status(500).json({ message: 'Database error.' });
                res.json({ message: 'Delivery details added.' });
            });
        }
    });
};
exports.viewDeliveryDetails = (req, res) => {
    connection.query('SELECT * FROM DeliveryDetails', (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json(results);
    });
}; 