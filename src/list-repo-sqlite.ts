import {ListRepository} from './list-repo-interface';
import {List, ListEntry} from './list';
import Database = require('better-sqlite3');

export interface ListRepositoryOptions {
    debug?:boolean, 
    dbCustomLocation?:string
}

export class ListRepositoryImpl implements ListRepository {

    private dbLocation = __dirname + '/db/shared-lists.db';
    private db:any;
    constructor(options?:ListRepositoryOptions) {
        const driverOptions = {fileMustExist: true, verbose:null};
        if (options) {
            console.log(`Creating database driver with custom options`);
            if (options.debug) {
                driverOptions.verbose = console.log;
            }
            if (options.dbCustomLocation) {
                this.db = new Database(options.dbCustomLocation, driverOptions);
            } else {
                this.db = new Database(this.dbLocation, driverOptions);
            }
        } else {
            console.log('Creating default database driver');
            this.db = new Database(this.dbLocation, driverOptions);
        }
       
    }

    createNewList(name: string, isPrivate: boolean): List {
        if (this.listExists(name)) {
            return null;
        }
        const newList = new List(name, isPrivate);
        const sql = 'INSERT INTO list (alias,private) VALUES (?,?)';
        const params = [name, (isPrivate?1:0)];
        const results=this.db.prepare(sql).run(params);
        newList.setId(results.lastInsertRowid);
        return newList;
    }    
    addListItem(listId: string, listItem: string): ListEntry {
        if (this.listExistsById(listId)) {
            const sql = 'INSERT INTO list_item (list_id, text) VALUES (?,?)';
            const results = this.db.prepare(sql).run(listId, listItem);
            if (results) {
                return {
                    id: results.lastInsertRowid,
                    title: listItem
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    listExistsById(listId: string) : boolean {
        const sql = 'SELECT * FROM list WHERE list_id=?';
        const results = this.db.prepare(sql).get(listId);
        return (results != null);
    }
    listExists(listName: string): boolean {
        return (this.getList(listName) != null);
    }
    completeListItem(listId: string, listItemId: number): boolean {
        const sql = 'DELETE FROM list_item WHERE list_item_id=?';
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