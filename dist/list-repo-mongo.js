"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_1 = require("./list");
const mongodb_1 = require("mongodb");
class ListRepositoryImpl {
    constructor() {
        this.url = 'mongodb://localhost:27070/shared-lists';
        this.dbName = 'shared-lists';
        this.collectionName = 'lists';
        this.mongoClient = new mongodb_1.MongoClient(this.url, {});
    }
    createNewList(name, isPrivate) {
        if (!this.listExists(name)) {
            const newList = new list_1.List(name, isPrivate);
            return this.insertNewList(newList);
        }
        else {
            return null;
        }
    }
    insertNewList(list) {
        this.mongoClient.connect((err, db) => {
            if (err)
                throw err;
            this.getCollection(db).insertOne(list).then(result => console.log(result.insertedId)).catch(error => console.error(error));
        });
        return list;
    }
    addListItem(listId, listItem) {
        let entry;
        this.mongoClient.connect((err, db) => {
            if (err)
                throw err;
            this.getCollection(db).updateOne({ _id: listId }, { $push: { items: { title: listItem } } }, (err, res) => {
                if (err)
                    throw err;
                entry.id = res.insertedId;
                entry.title = listItem;
                db.close();
            });
        });
        return entry;
    }
    listExists(listName) {
        let exists = false;
        this.mongoClient.connect((err, db) => {
            if (err)
                throw err;
            this.getCollection(db).findOne({ alias: listName }, (err, res) => {
                if (err)
                    throw err;
                if (res != null) {
                    exists = true;
                }
                db.close();
            });
        });
        return exists;
    }
    completeListItem(listId, listItemId) {
        this.mongoClient.connect((err, db) => {
            if (err)
                throw err;
            this.getCollection(db).updateOne({ _id: listId }, { $pull: { items: { _id: listItemId } } }, (err, res) => {
                if (err)
                    throw err;
                db.close();
            });
        });
        return true;
    }
    deleteList(listId) {
        this.mongoClient.connect((err, db) => {
            if (err)
                throw err;
            this.getCollection(db).deleteOne({ _id: listId }, (err, res) => {
                if (err)
                    throw err;
                console.log("1 list deleted");
                db.close();
            });
        });
        return true;
    }
    printAllLists() {
        this.mongoClient.connect((err, db) => {
            if (err)
                throw err;
            this.getCollection(db).find({}).toArray((err, result) => {
                if (err)
                    throw err;
                console.log(result);
                db.close();
            });
        });
    }
    getCollection(db) {
        return db.db(this.dbName).collection(this.collectionName);
    }
}
exports.ListRepositoryImpl = ListRepositoryImpl;
//# sourceMappingURL=list-repo-mongo.js.map