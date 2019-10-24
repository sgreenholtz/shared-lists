import {List} from "./list";
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

function insertNewList(list:List):List {
    mongoClient.connect((err, db)=>{
        if (err) throw err;
        getCollection(db).insertOne(list, (err, res)=>{
            if (err) throw err;
            list._id = res._id;
            db.close();
        });
    });
    return list;
}

export function addListItem(listName:string, listItem:string):boolean {
    mongoClient.connect((err, db)=>{
        if (err) throw err;
        getCollection(db).updateOne({alias:listName}, {$push: {items: {title: listItem}}} ,(err, res)=>{
            if (err) throw err;
            db.close();         
        });
    });
    return true;
}

export function listExists(listName: string):boolean {
    let exists = false;
    mongoClient.connect((err,db)=>{
        if (err) throw err;
        getCollection(db).findOne({alias:listName}, (err, res)=>{
            if (res != null) {
                exists = true;
            }
            db.close();
        });
    });
    return exists;
}

export function completeListItem(listName: string, listItemId: number): boolean {
    mongoClient.connect((err,db)=>{
        if (err) throw err;
        getCollection(db).updateOne({alias:listName}, {$pull:{items:{_id:listItemId}}}, (err,res)=>{
            if (err) throw err;
            db.close();
        });
    });
    return true;
}

export function deleteList(listName:string): boolean {
    mongoClient.connect((err, db)=>{
        if (err) throw err;
        getCollection(db).deleteOne({alias:listName},(err,res)=>{
            if (err) throw err;
            console.log(listName+" deleted");
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