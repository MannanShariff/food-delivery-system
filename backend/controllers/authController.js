const connection = require('../database');
const bcrypt = require('bcrypt');

exports.register = (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    // Check if user exists
    connection.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (results.length > 0) {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert user
        connection.query(
            'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role],
            (err2) => {
                if (err2) return res.status(500).json({ message: 'Registration failed.' });
                res.json({ message: 'Registration successful.' });
            }
        );
    });
};

exports.login = (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    connection.query('SELECT * FROM Users WHERE username = ? AND role = ?', [username, role], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        res.json({ message: 'Login successful.', role: user.role, userId: user.id });
    });
}; 