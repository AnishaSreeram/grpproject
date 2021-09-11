const express = require("express");

const app = express();

// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

const port = 8000;

app.get("/", (req,res) => {
    return res.send("home page");
});

const admin = (req,res) => {
    return res.send("admin dashboard");
}

const isAdmin = (req,res,next) => {
    console.log("isadmin is running");
    next();
}

const isLoggedIn = (req,res,next) => {
    console.log("checking if logged in");
    next();
}
app.get("/admin", isLoggedIn, isAdmin, admin);



app.get("/login", (req,res) => {
    return res.send("you are visitng a login route");
});

app.get("/signout", (req,res) => {
    return res.send("you are signed out");
});

app.get("/sign", (req,res) => {
    return res.send("sign up route");
});

app.listen(port, () => {
    console.log("server is up and running...");
});