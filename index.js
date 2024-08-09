const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta",
  password: "root",
});

let createRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;
  try {
    conn.query(q, (err, result) => {
      if (err) throw err;
      res.render("home.ejs", { result });
    });
  } catch (err) {
    console.log(err);
    res.send("Dho beda baler code lehos");
  }
});

app.get("/show", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    conn.query(q, (err, result) => {
      if (err) throw err;
      res.render("show.ejs", { result });
    });
  } catch (err) {
    console.log(err);
    res.send("Dho beda baler code lehos");
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = "${id}"`;

  try {
    conn.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      console.log(result);
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    res.send("Dho beda baler code lehos");
  }
});

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id = "${id}"`;
  try {
    conn.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("Wrong Password");
      } else {
        let q2 = `UPDATE user SET username = "${newUsername}" WHERE id = "${id}"`;
        conn.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/show");
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Dho beda baler code lehos");
  }
});

app.listen("8080", () => {
  console.log("Welcome to express");
});
