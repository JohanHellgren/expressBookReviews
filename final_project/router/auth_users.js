const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const jwtSecret = 'your_secret_key_here'

const isValid = (username)=>{ //returns boolean
 !users.some((user) => user.username === username)
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some((user) => username === user.username && password === user.password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body

    if(!username || !password) {
        return res.status(400).json({message: "You need a username and password"})
    }

    if(authenticatedUser(username, password)) {
        const token = jwt.sign({username: username}, jwtSecret, {expiresIn: '1h'})
        req.session.authorization = {token, username}

        return res.status(200).json({ message: "Login successful", token: token });
    } else {
        return res.status(401).json({message: "Invalid login info"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

/*
Task 7:

    Complete the code for logging in as a registered user.

Hint: The code must validate and sign in a customer based on the username and password created in Exercise 6. It must also save the user credentials for the session as a JWT.
As you are required to login as a customer, while testing the output on Postman, use the endpoint as "customer/login"

    Test the output on Postman.

    Please take a screenshot of the same and save it with the name 7-login.png for submitting under Task 7 for the Peer Review Assignment.

Task 8:

    Complete the code for adding or modifying a book review.

Hint: You have to give a review as a request query & it must get posted with the username (stored in the session) posted. If the same user posts a different review on the same ISBN, it should modify the existing review. If another user logs in and posts a review on the same ISBN, it will get added as a different review under the same ISBN.

    Test the output on Postman.

    Please take a screenshot of the same and save it with the name 8-reviewadded.png for submitting under Task 8 for the Peer Review Assignment.

Task 9:

Complete the code for deleting a book review under regd_users.delete("/auth/review/:isbn", (req, res) => {

Hint: Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users’.

    Test the output on Postman.

    Please take a screenshot of the same and save it with the name 9-deletereview.png for submitting under Task 9 for the Peer Review Assignment.

*/