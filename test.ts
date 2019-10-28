import {List, ListEntry} from "./list";
import {MongoClient} from 'mongodb';

const url = 'mongodb://localhost:27070/shared-lists';
const dbName = 'shared-lists';
const collectionName = 'lists';
const mongoClient = new MongoClient(url, {}); //{useUnifiedTopology:true}

export function createNewList(name:string, isPrivate:boolean):List {
    const newList = new List(name, isPrivate);
    return insertNewList(newList);
}

function insertNewList(list:List):List {
    let id:string;
    mongoClient.connect((err, db)=>{
        if (err) throw err;
        const id = db.db(dbName).collection(collectionName).insertOne(list, (err, res)=>{
            if (err) throw err;
            db.close();
            return res.insertedId;
        });
        console.log(id);
    });
    list.id = id;
    return list;
}

const newList = createNewList('newList',false);
// console.log(newList);