const mongo = require('mongodb');
const list = require('./list');

const url = 'mongodb://localhost:27017/shared-lists';
const dbName = 'shared-lists';

const mongoClient = new mongo.MongoClient(url, {useUnifiedTopology:true});
mongo.MongoClient.connect(url,(err, db)=>{
    if (err) throw err;
    const dbo = db.db(dbName);
    // dbo.createCollection('lists', (err, res)=>{
    //     if (err) throw err;
    // });
    const privateList = new list.List('to-do', true);
    dbo.collection('lists').insertOne(privateList, (err, res)=>{
        if (err) throw err;
        privateList._id=res.insertedId;
    });
    db.close();
});

function createNewList(name, isPrivate) {
    const newList = new list.List(name, isPrivate);
    return insertNewList(newList);
}

function insertNewList(list) {
    mongoClient.connect(url, (err, db)=>{
        if (err) throw err;
        db.db(dbName).collection('lists').insertOne(list, (err, res)=>{
            if (err) throw err;
            list._id = res._id;
        });
    });
    return list;
}
