"use strict";
exports.__esModule = true;
var listRepo = require("./list-repo");
var express = require("express");
var app = express();
var port = 3000;
//TODO: Return the IDs of the items created!!
//TODO: Null checks!!
//TODO: What happens if I pass in the ID of a list or a list-item that doesn't exist?
app.listen(port, function () { console.log("Listening on " + port); });
app.get('/list', function (req, res) { res.send('This is the shared list API'); });
app.post('/list/new', function (req, res) {
    var listName = req.body.listName;
    var listPrivate = req.body.private;
    console.log("Creating list " + listName + ", private=" + listPrivate);
    var listResult = listRepo.createNewList(listName, listPrivate);
    if (listResult == null) {
        console.log("List already exists with the name " + listName);
        res.status(200).body("List already exists with the name " + listName);
    }
    else {
        res.sendStatus(201);
    }
});
app.post('/list/item/add', function (req, res) {
    var listId = req.body.listId;
    var itemName = req.body.itemName;
    console.log("Adding " + itemName + " to list " + listId);
    var successfullyAdded = listRepo.addListItem(listId, itemName);
    if (successfullyAdded) {
        res.sendStatus(201);
    }
    else {
        res.sendStatus(500);
    }
});
app.post('/list/item/complete', function (req, res) {
    var listId = req.body.listId;
    var itemId = req.body.itemId;
    console.log("Setting item " + itemId + " on list " + listId + " as complete");
    var successfullyCompleted = listRepo.completeListItem(listId, itemId);
    if (successfullyCompleted) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(500);
    }
});
app.post('/list/delete', function (req, res) {
    var listId = req.body.listId;
    console.log("Deleting list with id " + listId);
    var successfullyDeleted = listRepo.deleteList(listId);
    if (successfullyDeleted) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(500);
    }
});
