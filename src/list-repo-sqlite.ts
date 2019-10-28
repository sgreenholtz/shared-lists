import {ListRepository} from './list-repo-interface';
import {List, ListEntry} from './list';
import Database = require('better-sqlite3');

export class ListRepositoryImpl implements ListRepository {

    private dbLocation = '../shared-lists.db';
    private db:any;
    constructor(debug?:boolean) {
        const options = {fileMustExist: true, verbose:null};
        if (debug) {
            options.verbose = console.log;
        }
        this.db = new Database(this.dbLocation, options);
    }

    createNewList(name: string, isPrivate: boolean): List {
        const newList = new List(name, isPrivate);
        const sql = 'INSERT INTO list (alias,private) VALUES (?,?)';
        const params = [name, (isPrivate?1:0)];
        const results=this.db.prepare(sql).run(params);
        newList.setId(results.lastInsertRowid);
        return newList;
    }    
    addListItem(listId: string, listItem: string): ListEntry {
        const sql = 'INSERT INTO list_item (list_id, text) VALUES (?,?)';
        const results = this.db.prepare(sql).run(listId, listItem);
        return {
            id: results.lastInsertRowid,
            title: results.text
        };
    }
    listExists(listName: string): boolean {
        return (this.getList(listName) != null);
    }
    completeListItem(listId: string, listItemId: number): boolean {
        const sql = 'UPDATE list_item SET completed=1 WHERE list_item_id=?';
        const results = this.db.prepare(sql).run(listItemId);
        return (results.changes===1);
    }
    deleteList(listId: string): boolean {
        if (this.clearList(listId)) {
            const sql = 'DELETE FROM list WHERE list_id=?';
            const results = this.db.prepare(sql).run(listId);
            return (results.changes===1);
        } else {
            return false;
        }
    }
    clearList(listId: string): boolean {
        const sql = 'DELETE FROM list_item WHERE list_id=?';
        const results = this.db.prepare(sql).run(listId);
        return (results.changes>0);
    }
    printAllLists(): void {
        console.log(this.db.prepare('SELECT * FROM list').all());
    }
    getList(listName:string): List {
        const sql = 'SELECT list_id, alias, private FROM list WHERE alias=?';
        const results = this.db.prepare(sql).get(listName);
        if (results) {
            const retreivedList = new List(results.alias, results.private);
            retreivedList.setId(results.list_id);
            return retreivedList;
        } else {
            return null;
        }
    }
}