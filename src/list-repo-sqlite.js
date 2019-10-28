"use strict";
exports.__esModule = true;
var list_1 = require("./list");
var Database = require("better-sqlite3");
var ListRepositoryImpl = /** @class */ (function () {
    function ListRepositoryImpl(debug) {
        this.dbLocation = '../shared-lists.db';
        var options = { fileMustExist: true, verbose: null };
        if (debug) {
            options.verbose = console.log;
        }
        this.db = new Database(this.dbLocation, options);
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
        var sql = 'INSERT INTO list_item (list_id, text) VALUES (?,?)';
        var results = this.db.prepare(sql).run(listId, listItem);
        return {
            id: results.lastInsertRowid,
            title: results.text
        };
    };
    ListRepositoryImpl.prototype.listExists = function (listName) {
        return (this.getList(listName) != null);
    };
    ListRepositoryImpl.prototype.completeListItem = function (listId, listItemId) {
        var sql = 'UPDATE list_item SET completed=1 WHERE list_item_id=?';
        var results = this.db.prepare(sql).run(listItemId);
        return (results.changes === 1);
    };
    ListRepositoryImpl.prototype.deleteList = function (listId) {
        if (this.clearList(listId)) {
            var sql = 'DELETE FROM list WHERE list_id=?';
            var results = this.db.prepare(sql).run(listId);
            return (results.changes === 1);
        }
        else {
            return false;
        }
    };
    ListRepositoryImpl.prototype.clearList = function (listId) {
        var sql = 'DELETE FROM list_item WHERE list_id=?';
        var results = this.db.prepare(sql).run(listId);
        return (results.changes > 0);
    };
    ListRepositoryImpl.prototype.printAllLists = function () {
        console.log(this.db.prepare('SELECT * FROM list').all());
    };
    ListRepositoryImpl.prototype.getList = function (listName) {
        var sql = 'SELECT list_id, alias, private FROM list WHERE alias=?';
        var results = this.db.prepare(sql).get(listName);
        if (results) {
            var retreivedList = new list_1.List(results.alias, results.private);
            retreivedList.setId(results.list_id);
            return retreivedList;
        }
        else {
            return null;
        }
    };
    return ListRepositoryImpl;
}());
exports.ListRepositoryImpl = ListRepositoryImpl;
