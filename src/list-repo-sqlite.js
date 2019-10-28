"use strict";
exports.__esModule = true;
var list_1 = require("./list");
var Database = require("better-sqlite3");
var ListRepositoryImpl = /** @class */ (function () {
    function ListRepositoryImpl() {
        this.dbLocation = '../shared-lists.db';
        this.db = new Database(this.dbLocation, { verbose: console.log, fileMustExist: true });
    }
    ListRepositoryImpl.prototype.createNewList = function (name, isPrivate) {
        var newList = new list_1.List(name, isPrivate);
        var sql = 'INSERT INTO list (alias,private) VALUES (?,?)';
        var params = [name, (isPrivate ? 1 : 0)];
        var results = this.db.prepare(sql).run(params);
        newList.setId(results.lastInsertRowid);
        return newList;
    };
    ListRepositoryImpl.prototype.addListItem = function (listId, listItem) {
        throw new Error("Method not implemented.");
    };
    ListRepositoryImpl.prototype.listExists = function (listName) {
        throw new Error("Method not implemented.");
    };
    ListRepositoryImpl.prototype.completeListItem = function (listId, listItemId) {
        throw new Error("Method not implemented.");
    };
    ListRepositoryImpl.prototype.deleteList = function (listId) {
        throw new Error("Method not implemented.");
    };
    ListRepositoryImpl.prototype.printAllLists = function () {
        throw new Error("Method not implemented.");
    };
    ListRepositoryImpl.prototype.getList = function (listName) {
        var sql = 'SELECT list_id, alias, private FROM list WHERE alias=?';
        var results = this.db.prepare(sql).get(listName);
        var retreivedList = new list_1.List(results.alias, results.private);
        retreivedList.setId(results.list_id);
        return retreivedList;
    };
    return ListRepositoryImpl;
}());
exports.ListRepositoryImpl = ListRepositoryImpl;
