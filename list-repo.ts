import {List, ListEntry} from "./list";
import {MongoClient} from 'mongodb';

const url = 'mongodb://localhost:27070/shared-lists';
const dbName = 'shared-lists';
const collectionName = 'lists';
const mongoClient = new MongoClient(url, {}); //{useUnifiedTopology:true}

export function createNewList(name:string, isPrivate:boolean):List {
    if (!listExists(name)) {
        const newList = new List(name, isPrivate);
        return insertNewList(newList);
    } else {
        return null;
    }
}

var insertedId = [];

function insertNewList(list:List):List {
    mongoClient.connect((err, db)=>{
        if (err) throw err;
        getCollection(db).insertOne(list).then(result => console.log(result.insertedId)).catch(error => console.error(error));
    });
    list.id = insertedId[0];
    return list;
}

export function addListItem(listId:string, listItem:string):ListEntry {
    let entry: ListEntry;
    mongoClient.connect((err, db)=>{
        if (err) throw err;
        getCollection(db).updateOne({_id:listId}, {$push: {items: {title: listItem}}} ,(err, res)=>{
            if (err) throw err;
            entry.id = res.insertedId;
            entry.title = listItem;
            db.close();
        });
    });
    return entry;
}

export function listExists(listName: string):boolean {
    let exists = false;
    mongoClient.connect((err,db)=>{
        if (err) throw err;
        getCollection(db).findOne({alias:listName}, (err, res)=>{
            if (err) throw err;
            if (res != null) {
                exists = true;
            }
            db.close();
        });
    });
    return exists;
}

export function completeListItem(listId: string, listItemId: number): boolean {
    mongoClient.connect((err,db)=>{
        if (err) throw err;
        getCollection(db).updateOne({_id:listId}, {$pull:{items:{_id:listItemId}}}, (err,res)=>{
            if (err) throw err;
            db.close();
        });
    });
    return true;
}

export function deleteList(listId:string): boolean {
    mongoClient.connect((err, db)=>{
        if (err) throw err;
        getCollection(db).deleteOne({_id:listId},(err,res)=>{
            if (err) throw err;
            console.log("1 list deleted");
            db.close();
        });
    });
    return true;
}

export function printAllLists(): void {
    mongoClient.connect((err, db)=>{
        if (err) throw err;
        getCollection(db).find({}).toArray((err,result)=>{
            if (err) throw err;
            console.log(result);
            db.close();
        });
    });
}

function getCollection(db): any {
    return db.db(dbName).collection(collectionName);
}