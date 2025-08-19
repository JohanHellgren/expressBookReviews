const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books)
  }).then(data => {
    return res.status(200).json(data)
  }).catch (err => {
    return res.status(500).json(err)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("No book found with the given ISBN.");
      }
    })
      .then(book => {
        return res.status(200).json({
          message: "Book details:",
          book: book
        });
      })
      .catch(error => {
        return res.status(404).json({ message: error });
      });
  });  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
  
    const foundBooks = [];
  
    Object.keys(books).forEach(key => {
      const book = books[key];
      if (book.author.toLowerCase() === author) {
        foundBooks.push({ isbn: key, ...book });
      }
    });
  
    if (foundBooks.length > 0) {
      return res.status(200).json({
        message: `Books by ${author}:`,
        books: foundBooks
      });
    } else {
      return res.status(404).json({ message: "No books found by author" });
    }
  });  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase()

  const foundBooks =[]

  Object.keys(books).forEach(key => {
    const book = books[key]
    if (book.title.toLowerCase() === title) {
        foundBooks.push({isbn: key, ...book})
    }
  })

  if (foundBooks.length > 0) {
    return res.status(200).json({
        message: `Books with title ${title}`,
        books: foundBooks
    })
  } else {
    return res.status(404).json({message: "No books with that title"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
