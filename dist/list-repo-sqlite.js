"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_1 = require("./list");
const Database = require("better-sqlite3");
class ListRepositoryImpl {
    constructor(options) {
        this.dbLocation = __dirname + '/db/shared-lists.db';
        const driverOptions = { fileMustExist: true, verbose: null };
        if (options) {
            console.log(`Creating database driver with custom options`);
            if (options.debug) {
                driverOptions.verbose = console.log;
            }
            if (options.dbCustomLocation) {
                this.db = new Database(options.dbCustomLocation, driverOptions);
            }
            else {
                this.db = new Database(this.dbLocation, driverOptions);
            }
        }
        else {
            console.log('Creating default database driver');
            this.db = new Database(this.dbLocation, driverOptions);
        }
    }
    createNewList(name, isPrivate) {
        if (this.listExists(name)) {
            return null;
        }
        const newList = new list_1.List(name, isPrivate);
        const sql = 'INSERT INTO list (alias,private) VALUES (?,?)';
        const params = [name, (isPrivate ? 1 : 0)];
        const results = this.db.prepare(sql).run(params);
        newList.setId(results.lastInsertRowid);
        return newList;
    }
    addListItem(listId, listItem) {
        if (this.listExistsById(listId)) {
            const sql = 'INSERT INTO list_item (list_id, text) VALUES (?,?)';
            const results = this.db.prepare(sql).run(listId, listItem);
            if (results) {
                return {
                    id: results.lastInsertRowid,
                    title: listItem
                };
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    listExistsById(listId) {
        const sql = 'SELECT * FROM list WHERE list_id=?';
        const results = this.db.prepare(sql).get(listId);
        return (results != null);
    }
    listExists(listName) {
        return (this.getList(listName) != null);
    }
    completeListItem(listId, listItemId) {
        const sql = 'DELETE FROM list_item WHERE list_item_id=?';
        const results = this.db.prepare(sql).run(listItemId);
        return (results.changes === 1);
    }
    deleteList(listId) {
        if (this.clearList(listId)) {
            const sql = 'DELETE FROM list WHERE list_id=?';
            const results = this.db.prepare(sql).run(listId);
            return (results.changes === 1);
        }
        else {
            return false;
        }
    }
    clearList(listId) {
        const sql = 'DELETE FROM list_item WHERE list_id=?';
        const results = this.db.prepare(sql).run(listId);
        return (results.changes > 0);
    }
    printAllLists() {
        console.log(this.db.prepare('SELECT * FROM list').all());
    }
    getList(listName) {
        const sql = 'SELECT list_id, alias, private FROM list WHERE alias=?';
        const results = this.db.prepare(sql).get(listName);
        if (results) {
            const retreivedList = new list_1.List(results.alias, results.private);
            retreivedList.setId(results.list_id);
            return retreivedList;
        }
        else {
            return null;
        }
    }
}
exports.ListRepositoryImpl = ListRepositoryImpl;
//# sourceMappingURL=list-repo-sqlite.js.map