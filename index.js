const express = require("express");
const app = express();
// Allows us to hide secure credentials for the database in a .env file
const dotenv = require('dotenv');
// Links us to the mongo database
const mongoose = require("mongoose");

const TodoTask = require("./models/TodoTask");

dotenv.config();

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");

    app.listen(3000, () => console.log("Server Up and running"));
});

// Jacksonian Concept: Templating Engines
app.set("view engine", "ejs")

// GET METHOD -- allows us to retrieve todos from the db
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    // Jacksonian Concept: Render
    res.render("todo.ejs", { todoTasks: tasks });
    });
    });
    
//POST METHOD -- allows us to create new todos
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
    });
    // Jacksonian Concept: Error Handling
    try {
    // Jacksonian Concept: Asynchronous 
    await todoTask.save();
    // Jacksonian Concept: Redirect
    res.redirect("/");
    } catch (err) {
    res.redirect("/");
    }
    });
    
//UPDATE -- allows us to update todos
app
// Jacksonian Concept: Dynamic URLs
.route("/edit/:id")
.get((req, res) => {
    // Jacksonian Concept: Parameter
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
})
.post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        // Error handling 
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//DELETE -- allows us to remove todos 
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });
    

