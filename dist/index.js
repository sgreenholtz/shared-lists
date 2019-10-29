"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_repo_mongo_1 = require("./list-repo-mongo");
const express = require("express");
const app = express();
const port = 3000;
const listRepo = new list_repo_mongo_1.ListRepositoryImpl();
//TODO: Null checks!!
//TODO: What happens if I pass in the ID of a list or a list-item that doesn't exist?
app.use(express.json());
app.listen(port, () => { console.log(`Listening on ${port}`); });
app.get('/list', (req, res) => { res.send('This is the shared list API'); });
app.post('/list/new', (req, res) => {
    doNullChecks(req, res, 'listName', 'private');
    const listName = req.body.listName;
    const listPrivate = req.body.private;
    console.log(`Creating list ${listName}, private=${listPrivate}`);
    const listResult = listRepo.createNewList(listName, listPrivate);
    console.log(listResult);
    if (listResult == null) {
        console.log(`List already exists with the name ${listName}`);
        res.status(200).send(`List already exists with the name ${listName}`).end();
    }
    else {
        res.type('application/json');
        res.status(201).send(listResult).end();
    }
});
function doNullChecks(req, res, ...params) {
    noBodyInRequestCheck(req, res);
    bodyParamsCheck(req, res, params);
}
function noBodyInRequestCheck(req, res) {
    if (!req.hasOwnProperty('body') || req.body == null) {
        res.status(400).send('Request is missing a body!').end();
    }
}
function bodyParamsCheck(req, res, params) {
    let missing = false;
    for (let i = 0; i < params.length; i++) {
        if (!req.body.hasOwnProperty(params[i])) {
            missing = true;
            break;
        }
    }
    if (missing) {
        res.status(400).send('Request is missing a required parameter').end();
    }
}
app.post('/list/item/add', (req, res) => {
    const listId = req.body.listId;
    const itemName = req.body.itemName;
    console.log(`Adding ${itemName} to list ${listId}`);
    const successfullyAdded = listRepo.addListItem(listId, itemName);
    if (successfullyAdded) {
        res.sendStatus(201);
    }
    else {
        res.sendStatus(500);
    }
});
app.post('/list/item/complete', (req, res) => {
    const listId = req.body.listId;
    const itemId = req.body.itemId;
    console.log(`Setting item ${itemId} on list ${listId} as complete`);
    const successfullyCompleted = listRepo.completeListItem(listId, itemId);
    if (successfullyCompleted) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(500);
    }
});
app.post('/list/delete', (req, res) => {
    const listId = req.body.listId;
    console.log(`Deleting list with id ${listId}`);
    const successfullyDeleted = listRepo.deleteList(listId);
    if (successfullyDeleted) {
        res.sendStatus(200);
    }
    else {
        res.sendStatus(500);
    }
});
//# sourceMappingURL=index.js.map