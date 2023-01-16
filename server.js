const path = require('path');
var HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const app = express();
app.use(bodyparser.json());
app.use(cors());
dotenv.config({ path: "./key.env" });
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API Listening" })
});

app.post("/api/movies", (req, res) => {
    db.addNewMovie(req.body).then((MovieObj) => {
        res.status(201).json(MovieObj);
    }).catch((err) => {
        console.log(err);
        res.status(500).send("There was an error while adding the movie, Try again later!")
    });
});

app.get("/api/movies", (req, res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((MovieArr) => {
        res.status(200).json(MovieArr);
    }).catch((err) => {
        res.status(500).send("Error getting movies");
    })
});

app.get("/api/movies/:mID", (req, res) => {
    db.getMovieById(req.params.mID).then((MovieObj) => {
        res.status(200).json(MovieObj);
    }).catch((err) => {
        res.status(500).send("Error getting the movie");
    })
});

app.put("/api/movie/:mID", (req, res) => {
    db.updateMovieById(req.body, req.params.mID).then( () => {
        res.status(200).send("Updated Sucessfully");
    }).catch((err) => {
        res.status(500).send("There was error updating the movie");
    })
});

app.delete("/api/movies/:mID", (req, res) => {
    db.deleteMovieById(req.params.mID).then( () => {
        res.status(200).send("Deleted Sucessfully");
    }).catch((err) => {
        res.status(500).send("There was error deleting the movie");
    })
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});



app.use((req, res) => {
    res.status(404).send("Page Not Found");
});
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});


//63c4ba48cf0b30df2a0cc191