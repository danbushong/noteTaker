const express = require("express");
const path = require("path");
const fs = require("fs");

//set up express + heroku
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
//go into the public folder
app.use(express.static("public"));



app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "public/index.html"));
})

app.get("api/notes", function(req, res){
    res.sendFile(path.join(__dirname, "db.json"));
});

app.listen(PORT, function(){
    console.log("listening on PORT" + PORT)
})