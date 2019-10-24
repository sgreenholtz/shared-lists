"use strict";
exports.__esModule = true;
var list_1 = require("./list");
var mongodb_1 = require("mongodb");
var url = 'mongodb://localhost:27070/shared-lists';
var dbName = 'shared-lists';
var collectionName = 'lists';
var mongoClient = new mongodb_1.MongoClient(url, {}); //{useUnifiedTopology:true}
function createNewList(name, isPrivate) {
    if (!listExists(name)) {
        var newList = new list_1.List(name, isPrivate);
        return insertNewList(newList);
    }
    else {
        return null;
    }
}
exports.createNewList = createNewList;
function insertNewList(list) {
    mongoClient.connect(function (err, db) {
        if (err)
            throw err;
        getCollection(db).insertOne(list, function (err, res) {
            if (err)
                throw err;
            list._id = res._id;
            db.close();
        });
    });
    return list;
}
function addListItem(listId, listItem) {
    mongoClient.connect(function (err, db) {
        if (err)
            throw err;
        getCollection(db).updateOne({ _id: listId }, { $push: { items: { title: listItem } } }, function (err, res) {
            if (err)
                throw err;
            db.close();
        });
    });
    return true;
}
exports.addListItem = addListItem;
function listExists(listName) {
    var exists = false;
    mongoClient.connect(function (err, db) {
        if (err)
            throw err;
        getCollection(db).findOne({ alias: listName }, function (err, res) {
            if (res != null) {
                exists = true;
            }
            db.close();
        });
    });
    return exists;
}
exports.listExists = listExists;
function completeListItem(listId, listItemId) {
    mongoClient.connect(function (err, db) {
        if (err)
            throw err;
        getCollection(db).updateOne({ _id: listId }, { $pull: { items: { _id: listItemId } } }, function (err, res) {
            if (err)
                throw err;
            db.close();
        });
    });
    return true;
}
exports.completeListItem = completeListItem;
function deleteList(listId) {
    mongoClient.connect(function (err, db) {
        if (err)
            throw err;
        getCollection(db).deleteOne({ _id: listId }, function (err, res) {
            if (err)
                throw err;
            console.log("1 list deleted");
            db.close();
        });
    });
    return true;
}
exports.deleteList = deleteList;
function printAllLists() {
    mongoClient.connect(function (err, db) {
        if (err)
            throw err;
        getCollection(db).find({}).toArray(function (err, result) {
            if (err)
                throw err;
            console.log(result);
            db.close();
        });
    });
}
exports.printAllLists = printAllLists;
function getCollection(db) {
    return db.db(dbName).collection(collectionName);
}
