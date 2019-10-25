"use strict";
exports.__esModule = true;
var mongo = require("mongodb");
var ids = ['5db2f78a3587ab0da94a0f8e'];
var newId = mongo.MongoClient.connect('mongodb://localhost:27070/shared-lists', function (err, db) {
    if (err)
        throw err;
    db.db('shared-lists').collection('lists').insertOne({ alias: 'demo2', private: true }, function (err, insertedDoc) {
        if (err)
            throw err;
        db.close();
        return insertedDoc.insertedId;
    });
});
ids.push(newId);
console.log(ids);
mongo.MongoClient.connect('mongodb://localhost:27070/shared-lists', function (err, db) {
    if (err)
        throw err;
    ids.forEach(function (id) {
        db.db('shared-lists').collection('lists').deleteOne({ _id: id }, function (err, res) {
            if (err)
                throw err;
            console.log(res);
            db.close();
        });
    });
});
