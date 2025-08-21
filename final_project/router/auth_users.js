const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const jwtSecret = 'your_secret_key_here'; // use a strong secret key in production

// Helper: check if username exists
const isValid = (username) => {
  return !users.some((user) => user.username === username);
};

// Helper: check if username/password is correct
const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

// 🔐 JWT middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.username = decoded.username; // 👈 add username to request
    next();
  });
};

// 🔑 Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// 📝 Add or update a review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.username; // 👈 from JWT

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added or updated" });
});

// 🗑️ Delete a review
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.username; // 👈 from JWT

  if (!books[isbn] || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
