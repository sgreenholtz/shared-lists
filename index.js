const mongo = require('mongodb');
const list = require('./list');

const url = 'mongodb://localhost:27070/shared-lists';
const dbName = 'shared-lists';
const collectionName = 'lists';
const mongoClient = new mongo.MongoClient(url, {useUnifiedTopology:true});



function createNewList(name, isPrivate) {
    const newList = new list.List(name, isPrivate);
    return insertNewList(newList);
}

function insertNewList(list) {
    mongoClient.connect(url, (err, db)=>{
        if (err) throw err;
        getCollection(db).insertOne(list, (err, res)=>{
            if (err) throw err;
            list._id = res._id;
            db.close();
        });
    });
    return list;
}

function addListItem(listName, listItem) {
    mongoClient.connect(url, (err, db)=>{
        if (err) throw err;
        getCollection(db).updateOne({alias:listName}, {$push: {items: {title: listItem}}} ,(err, res)=>{
            if (err) throw err;
            console.log(res);   
            db.close();         
        });
    });
}

function completeListItem(listName, listItemId) {
    mongoClient.connect(url,(err,db)=>{
        if (err) throw err;
        getCollection(db).updateOne({alias:listName}, {$pull:{items:{_id:listItemId}}}, (err,res)=>{
            if (err) throw err;
            console.log(res);
            db.close();
        });
    });
}

function deleteList(listName) {
    mongoClient.connect(url, (err, db)=>{
        if (err) throw err;
        getCollection(db).deleteOne({alias:listName},(err,res)=>{
            if (err) throw err;
            console.log(listName+" deleted");
            db.close();
        });
    });
}

function getCollection(db) {
    return db.db(dbName).collection(collectionName);
}