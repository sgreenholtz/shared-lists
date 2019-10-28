import {List, ListEntry} from "./list";
import {MongoClient} from 'mongodb';
import {ListRepository} from './list-repo-interface'

export class ListRepositoryImpl implements ListRepository {
    url = 'mongodb://localhost:27070/shared-lists';
    dbName = 'shared-lists';
    collectionName = 'lists';
    mongoClient = new MongoClient(this.url, {});

    createNewList(name:string, isPrivate:boolean):List {
        if (!this.listExists(name)) {
            const newList = new List(name, isPrivate);
            return this.insertNewList(newList);
        } else {
            return null;
        }
    }

    insertNewList(list:List):List {
        this.mongoClient.connect((err, db)=>{
            if (err) throw err;
            this.getCollection(db).insertOne(list).then(result => console.log(result.insertedId)).catch(error => console.error(error));
        });
        return list;
    }

    addListItem(listId:string, listItem:string):ListEntry {
        let entry: ListEntry;
        this.mongoClient.connect((err, db)=>{
            if (err) throw err;
            this.getCollection(db).updateOne({_id:listId}, {$push: {items: {title: listItem}}} ,(err, res)=>{
                if (err) throw err;
                entry.id = res.insertedId;
                entry.title = listItem;
                db.close();
            });
        });
        return entry;
    }

    listExists(listName: string):boolean {
        let exists = false;
        this.mongoClient.connect((err,db)=>{
            if (err) throw err;
            this.getCollection(db).findOne({alias:listName}, (err, res)=>{
                if (err) throw err;
                if (res != null) {
                    exists = true;
                }
                db.close();
            });
        });
        return exists;
    }

    completeListItem(listId: string, listItemId: number): boolean {
        this.mongoClient.connect((err,db)=>{
            if (err) throw err;
            this.getCollection(db).updateOne({_id:listId}, {$pull:{items:{_id:listItemId}}}, (err,res)=>{
                if (err) throw err;
                db.close();
            });
        });
        return true;
    }

    deleteList(listId:string): boolean {
        this.mongoClient.connect((err, db)=>{
            if (err) throw err;
            this.getCollection(db).deleteOne({_id:listId},(err,res)=>{
                if (err) throw err;
                console.log("1 list deleted");
                db.close();
            });
        });
        return true;
    }

    printAllLists(): void {
        this.mongoClient.connect((err, db)=>{
            if (err) throw err;
            this.getCollection(db).find({}).toArray((err,result)=>{
                if (err) throw err;
                console.log(result);
                db.close();
            });
        });
    }

    getCollection(db): any {
        return db.db(this.dbName).collection(this.collectionName);
    }

}