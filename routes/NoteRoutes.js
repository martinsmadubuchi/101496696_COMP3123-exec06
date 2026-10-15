
/*
We want to set up our paths, other words our routes,
to the different URLs that the server can serve
on different methods GET, POST, PUT, DELETE
*/

const NotesModel = require("../models/NotesModel.js");
const express = require("express");
const router = express.Router();

// POST - Create a new note
router.post("/notes", async (request, response) => {
    if (!request.body.content) {
        return response.status(400).send({
            message: "Note cannot be empty, must fill in the request body"
        });
    }

    try {
        const note = new NotesModel({
            noteTitle: request.body.content.noteTitle,
            noteDescription: request.body.content.noteDescription,
            priority: request.body.content.priority,
            dateAdded: request.body.content.dateAdded,
            dateUpdated: request.body.content.dateUpdated
        });

        const savedNote = await note.save();
        response.status(201).send(savedNote);
    } catch (error) {
        response.status(500).send({
            message: error.message || "Some error occurred while creating the Note"
        });
    }
});

// GET - Retrieve all notes
router.get("/notes", async (request, response) => {
    try {
        const notes = await NotesModel.find();
        response.status(200).send(notes);
    } catch (error) {
        response.status(500).send({
            message: error.message || "Error retrieving notes"
        });
    }
});

// GET - Retrieve one note by ID
router.get("/notes/:noteId", async (request, response) => {
    try {
        const note = await NotesModel.findById(request.params.noteId);

        if (!note) {
            return response.status(404).send({
                message: "Note not found"
            });
        }

        response.status(200).send(note);
    } catch (error) {
        response.status(500).send({
            message: error.message || "Error retrieving note"
        });
    }
});

// PUT - Update a note by ID
router.put("/notes/:noteId", async (request, response) => {
    if (!request.body.content) {
        return response.status(400).send({
            message: "Note content cannot be empty"
        });
    }

    try {
        const updatedNote = await NotesModel.findByIdAndUpdate(
            request.params.noteId,
            request.body.content,
            { new: true, runValidators: true }
        );

        if (!updatedNote) {
            return response.status(404).send({
                message: "Note not found"
            });
        }

        response.status(200).send(updatedNote);
    } catch (error) {
        response.status(500).send({
            message: error.message || "Error updating note"
        });
    }
});

// DELETE - Delete a note by ID
router.delete("/notes/:noteId", async (request, response) => {
    try {
        const deletedNote = await NotesModel.findByIdAndDelete(
            request.params.noteId
        );

        if (!deletedNote) {
            return response.status(404).send({
                message: "Note not found"
            });
        }

        response.status(200).send({
            message: "Note deleted successfully"
        });
    } catch (error) {
        response.status(500).send({
            message: error.message || "Error deleting note"
        });
    }
});

module.exports = router;
