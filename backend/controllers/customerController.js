const connection = require('../database');

exports.viewFoodsByCategory = (req, res) => {
    const { category, search } = req.query;
    let sql = 'SELECT Foods.*, Categories.name AS category_name FROM Foods LEFT JOIN Categories ON Foods.category_id = Categories.id';
    const params = [];
    if (category) {
        sql += ' WHERE Foods.category_id = ?';
        params.push(category);
    }
    if (search) {
        sql += category ? ' AND' : ' WHERE';
        sql += ' Foods.name LIKE ?';
        params.push(`%${search}%`);
    }
    connection.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json(results);
    });
};

exports.searchFoods = (req, res) => res.send('Search Foods');
exports.addToCart = (req, res) => {
    const { user_id, food_id, quantity } = req.body;
    if (!user_id || !food_id || !quantity) return res.status(400).json({ message: 'All fields are required.' });
    // Check if item already in cart
    connection.query('SELECT * FROM Cart WHERE user_id=? AND food_id=?', [user_id, food_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (results.length > 0) {
            // Update quantity
            connection.query('UPDATE Cart SET quantity=quantity+? WHERE user_id=? AND food_id=?', [quantity, user_id, food_id], (err2) => {
                if (err2) return res.status(500).json({ message: 'Database error.' });
                res.json({ message: 'Cart updated.' });
            });
        } else {
            // Insert new
            connection.query('INSERT INTO Cart (user_id, food_id, quantity) VALUES (?, ?, ?)', [user_id, food_id, quantity], (err2) => {
                if (err2) return res.status(500).json({ message: 'Database error.' });
                res.json({ message: 'Added to cart.' });
            });
        }
    });
};
exports.removeFromCart = (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM Cart WHERE id=?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json({ message: 'Item removed from cart.' });
    });
};
exports.viewCart = (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'User ID required.' });
    const sql = `SELECT Cart.id, Cart.quantity, Foods.name AS food_name, Foods.price, Categories.name AS category_name
                 FROM Cart
                 JOIN Foods ON Cart.food_id = Foods.id
                 LEFT JOIN Categories ON Foods.category_id = Categories.id
                 WHERE Cart.user_id = ?`;
    connection.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json(results);
    });
};
exports.placeOrder = (req, res) => {
    const { user_id, address } = req.body;
    if (!user_id || !address) return res.status(400).json({ message: 'User ID and address required.' });
    // Get cart items
    connection.query('SELECT * FROM Cart WHERE user_id=?', [user_id], (err, cartItems) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty.' });
        // Create order with address
        connection.query('INSERT INTO Orders (user_id, status, address) VALUES (?, ?, ?)', [user_id, 'Placed', address], (err2, orderResult) => {
            if (err2) return res.status(500).json({ message: 'Database error.' });
            const order_id = orderResult.insertId;
            // Insert order items
            const orderItemsData = cartItems.map(item => [order_id, item.food_id, item.quantity]);
            connection.query('INSERT INTO OrderItems (order_id, food_id, quantity) VALUES ?', [orderItemsData], (err3) => {
                if (err3) return res.status(500).json({ message: 'Database error.' });
                // Clear cart
                connection.query('DELETE FROM Cart WHERE user_id=?', [user_id], (err4) => {
                    if (err4) return res.status(500).json({ message: 'Database error.' });
                    res.json({ message: 'Order placed successfully.' });
                });
            });
        });
    });
};
exports.viewOrders = (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'User ID required.' });
    connection.query('SELECT * FROM Orders WHERE user_id=? ORDER BY order_date DESC', [user_id], (err, orders) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (orders.length === 0) return res.json([]);
        // Get all order IDs
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
exports.viewDeliveryDetails = (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: 'User ID required.' });
    const sql = `SELECT DeliveryDetails.order_id, DeliveryDetails.address, DeliveryDetails.delivery_status
                 FROM DeliveryDetails
                 JOIN Orders ON DeliveryDetails.order_id = Orders.id
                 WHERE Orders.user_id = ?`;
    connection.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        res.json(results);
    });
}; 