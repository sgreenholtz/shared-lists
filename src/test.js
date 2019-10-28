"use strict";
exports.__esModule = true;
var list_1 = require("./list");
var mongodb_1 = require("mongodb");
var url = 'mongodb://localhost:27070/shared-lists';
var dbName = 'shared-lists';
var collectionName = 'lists';
var mongoClient = new mongodb_1.MongoClient(url, {}); //{useUnifiedTopology:true}
function createNewList(name, isPrivate) {
    var newList = new list_1.List(name, isPrivate);
    return insertNewList(newList);
}
exports.createNewList = createNewList;
function insertNewList(list) {
    var id;
    mongoClient.connect(function (err, db) {
        if (err)
            throw err;
        var id = db.db(dbName).collection(collectionName).insertOne(list, function (err, res) {
            if (err)
                throw err;
            db.close();
            return res.insertedId;
        });
        console.log(id);
    });
    list.id = id;
    return list;
}
var newList = createNewList('newList', false);
// console.log(newList);
