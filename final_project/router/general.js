const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username
    const password = req.body.password

    if (!username) {
        return res.status(400).json({message: "You must enter a username"})
    }
    if(!password) {
        return res.status(400).json({message: "You must enter a password"})
    }

    const existingUser = users.some((user) => user.username === username)
    if(existingUser) {
        return res.status(400).json({message: "User already exists"})
    }

    users.push({username, password})

    return res.status(201).json({message: "User has been added"})
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const getBooks = () => {
        return new Promise((resolve, reject) => {
          resolve(books);
        });
      };
  
      const bookList = await getBooks();
      return res.status(200).json(bookList);
    } catch (err) {
      return res.status(500).json({ message: "Error retrieving books", error: err });
    }
  });

// Get book details based on ISBN
// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const getBookByISBN = (isbn) => {
        return new Promise((resolve, reject) => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject("Book not found");
          }
        });
      };
  
      const book = await getBookByISBN(isbn);
      return res.status(200).json({
        message: "Book details:",
        book: book
      });
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });
  
  
// Get book details based on author
// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();
  
    try {
      const getBooksByAuthor = () => {
        return new Promise((resolve, reject) => {
          const foundBooks = [];
          Object.keys(books).forEach(key => {
            const book = books[key];
            if (book.author.toLowerCase() === author) {
              foundBooks.push({ isbn: key, ...book });
            }
          });
  
          if (foundBooks.length > 0) {
            resolve(foundBooks);
          } else {
            reject("No books found by author");
          }
        });
      };
  
      const booksByAuthor = await getBooksByAuthor();
      return res.status(200).json({
        message: `Books by ${author}:`,
        books: booksByAuthor
      });
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });    

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();
  
    try {
      const getBooksByTitle = () => {
        return new Promise((resolve, reject) => {
          const foundBooks = [];
          Object.keys(books).forEach(key => {
            const book = books[key];
            if (book.title.toLowerCase() === title) {
              foundBooks.push({ isbn: key, ...book });
            }
          });
  
          if (foundBooks.length > 0) {
            resolve(foundBooks);
          } else {
            reject("No books found with that title");
          }
        });
      };
  
      const booksByTitle = await getBooksByTitle();
      return res.status(200).json({
        message: `Books with title "${title}"`,
        books: booksByTitle
      });
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  const reviews = book.reviews;
  if (reviews) {
    return res.status(200).json({
        message: `Reviews for ${book.title}:`,
        reviews: book.reviews
    })
  } else {
    return res.status(404).json({message: "No reviews found"})
  }
});

module.exports.general = public_users;
