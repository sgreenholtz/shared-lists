const mongo = require('mongodb');

const mongoClient = mongo.MongoClient;
let dbo = undefined;
mongoClient.connect('mongodb://localhost:27017/shared-lists', (err, db)=>{
    if (err) throw err;
    dbo = db.db('shared-lists');
});