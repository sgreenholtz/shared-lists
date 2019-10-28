import {ListRepository} from './list-repo-interface';
import {List, ListEntry} from './list';
import Database = require('better-sqlite3');

export class ListRepositoryImpl implements ListRepository {

    private dbLocation = '../shared-lists.db';
    private db:any;
    constructor() {
        this.db = new Database(this.dbLocation, {verbose: console.log, fileMustExist: true});
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
        throw new Error("Method not implemented.");
    }
    listExists(listName: string): boolean {
        throw new Error("Method not implemented.");
    }
    completeListItem(listId: string, listItemId: number): boolean {
        throw new Error("Method not implemented.");
    }
    deleteList(listId: string): boolean {
        throw new Error("Method not implemented.");
    }
    printAllLists(): void {
        throw new Error("Method not implemented.");
    }
    getList(listName:string): List {
        const sql = 'SELECT list_id, alias, private FROM list WHERE alias=?';
        const results = this.db.prepare(sql).get(listName);
        const retreivedList = new List(results.alias, results.private);
        retreivedList.setId(results.list_id);
        return retreivedList;
    }
}