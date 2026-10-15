
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const noteRoutes = require("./routes/NoteRoutes.js");
const DB_URL = process.env.MONGODB_URI;

const PORT = process.env.PORT || 8081;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (request, response) => {
    response.send("<h2>Welcome to the Note taking application - Server root path contents </h2>");
});

// Set up API routes
app.use("/api", noteRoutes);

// Connect to MongoDB Atlas
mongoose.connect(DB_URL)
    .then(() => {
        console.log("Successfully connected to the MongoDB Atlas Server");

        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Could not connect to the DB:", error.message);
        process.exit(1);
    });
