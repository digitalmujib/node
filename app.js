require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("home");
});

app.route("/login")
    .get(function (req, res) {
        res.render("login");
    })

    .post(function (req, res) {
        const username = req.body.username;
        const password = req.body.password;

        User.findOne({ email: username }, function (err, foundUser) {
            if (err) {
                console.log(err);
            }
            else if (foundUser.password === password) {
                res.render("secrets");
            }
        });
    });

app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })

    .post(function (req, res) {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save(function (err) {
            if (!err) {
                res.render("secrets");
            }
            else {
                console.log(err);
            }
        });
    });

app.listen(process.env.PORT || 3000, () => {
    console.log("Sever stared on port 3000");
});