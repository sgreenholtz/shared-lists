"use strict";
exports.__esModule = true;
var list_1 = require("./list");
var mongodb_1 = require("mongodb");
var ListRepositoryImpl = /** @class */ (function () {
    function ListRepositoryImpl() {
        this.url = 'mongodb://localhost:27070/shared-lists';
        this.dbName = 'shared-lists';
        this.collectionName = 'lists';
        this.mongoClient = new mongodb_1.MongoClient(this.url, {});
    }
    ListRepositoryImpl.prototype.createNewList = function (name, isPrivate) {
        if (!this.listExists(name)) {
            var newList = new list_1.List(name, isPrivate);
            return this.insertNewList(newList);
        }
        else {
            return null;
        }
    };
    ListRepositoryImpl.prototype.insertNewList = function (list) {
        var _this = this;
        this.mongoClient.connect(function (err, db) {
            if (err)
                throw err;
            _this.getCollection(db).insertOne(list).then(function (result) { return console.log(result.insertedId); })["catch"](function (error) { return console.error(error); });
        });
        return list;
    };
    ListRepositoryImpl.prototype.addListItem = function (listId, listItem) {
        var _this = this;
        var entry;
        this.mongoClient.connect(function (err, db) {
            if (err)
                throw err;
            _this.getCollection(db).updateOne({ _id: listId }, { $push: { items: { title: listItem } } }, function (err, res) {
                if (err)
                    throw err;
                entry.id = res.insertedId;
                entry.title = listItem;
                db.close();
            });
        });
        return entry;
    };
    ListRepositoryImpl.prototype.listExists = function (listName) {
        var _this = this;
        var exists = false;
        this.mongoClient.connect(function (err, db) {
            if (err)
                throw err;
            _this.getCollection(db).findOne({ alias: listName }, function (err, res) {
                if (err)
                    throw err;
                if (res != null) {
                    exists = true;
                }
                db.close();
            });
        });
        return exists;
    };
    ListRepositoryImpl.prototype.completeListItem = function (listId, listItemId) {
        var _this = this;
        this.mongoClient.connect(function (err, db) {
            if (err)
                throw err;
            _this.getCollection(db).updateOne({ _id: listId }, { $pull: { items: { _id: listItemId } } }, function (err, res) {
                if (err)
                    throw err;
                db.close();
            });
        });
        return true;
    };
    ListRepositoryImpl.prototype.deleteList = function (listId) {
        var _this = this;
        this.mongoClient.connect(function (err, db) {
            if (err)
                throw err;
            _this.getCollection(db).deleteOne({ _id: listId }, function (err, res) {
                if (err)
                    throw err;
                console.log("1 list deleted");
                db.close();
            });
        });
        return true;
    };
    ListRepositoryImpl.prototype.printAllLists = function () {
        var _this = this;
        this.mongoClient.connect(function (err, db) {
            if (err)
                throw err;
            _this.getCollection(db).find({}).toArray(function (err, result) {
                if (err)
                    throw err;
                console.log(result);
                db.close();
            });
        });
    };
    ListRepositoryImpl.prototype.getCollection = function (db) {
        return db.db(this.dbName).collection(this.collectionName);
    };
    return ListRepositoryImpl;
}());
exports.ListRepositoryImpl = ListRepositoryImpl;
