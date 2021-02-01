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

app.post("/api/notes", function( req, res){
    //might need to use that star thing
    fs.readFile(path.join(__dirname, "db.json"), function(error, response){
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
        res.JSON(newNote);
        //here too for the star thing
        fs.writeFile(path.join(__dirname, "db.json"), JSON.stringify(notes, null, 2), function(err){
            if(err) throw err;
        });
    });
});

app.delete("/api/notes/:id", function(req, res){
    const deleteId = req.params.id;
    //star thing here too maybe
    false.readFile("db.json", function(error, response){
        if(error) {
            console.log(error);
        }
        let notes = JSON.parse(response);


        if (deleteId <= notes.length) {
            res.json(notes.splice(deleteId-1,1));
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

app.listen(PORT, function(){
    console.log("listening on PORT" + PORT)
})