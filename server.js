const express = require("express");
const path = require("path");
const fs = require("fs");

//set up express + heroku port
const app = express();
const PORT = process.env.PORT || 8080;
//parse it up
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//go into the public folder
app.use(express.static("public"));

//all the different routes

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "public/index.html"));
})

app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


app.get("/api/notes", function(req, res){
    res.sendFile(path.join(__dirname, "db.json"));
});

//updates/creates object to add to the db and creates an open space for new object
app.post("/api/notes", function( req, res){
    //the internet told me to use utf8
    fs.readFile(path.join(__dirname, "db.json"),"utf8", function(error, response){
        if(error){
            console.log(error);
        }
        const notes = JSON.parse(response);
        const newNoteId = notes.length + 1;
        const noteRequest = req.body;
        const newNote = {
            id: newNoteId,
            title: noteRequest.title,
            text: noteRequest.text
        };
        notes.push(newNote);
        res.json(newNote);
        fs.writeFile(path.join(__dirname, "db.json"), JSON.stringify(notes, null, 2), function(err){
            if(err) throw err;
        });
    });
});
//delete the object with the coresponding id
app.delete("/api/notes/:id", function(req, res){
    const deleteId = req.params.id;
    //internet and that utf8
    fs.readFile("db.json","utf8", function(error, response){
        if(error) {
            console.log(error);
        }
        let notes = JSON.parse(response);
        if (deleteId <= notes.length) {
            //actually does the deleting
            res.json(notes.splice(deleteId-1,1));
            //fixes the notes id that are left
            for (let i=0; i<notes.length; i++) {
                notes[i].id = i+1;
            }
            fs.writeFile("db.json", JSON.stringify(notes, null, 2), function(err) {
                if (err) throw err;
            });
        } else {
            res.json(false);
        }
    })
})
//listens to the port
app.listen(PORT, function(){
    console.log("listening on PORT" + PORT)
})