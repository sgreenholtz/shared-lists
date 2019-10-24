import listRepo = require('./list-repo');
import express = require('express');
const app = express();
const port = 3000;

app.listen(port, ()=>{ console.log(`Listening on ${port}`) });
app.get('/list',(req,res)=>{res.send('This is the shared list API')});
app.post('/list/new', (req,res)=>{
    const listName = req.body.listName;
    const listPrivate = req.body.private;
    console.log(`Creating list ${listName}, private=${listPrivate}`);
    const listResult = listRepo.createNewList(listName,listPrivate);
    if (listResult==null) {
        console.log(`List already exists with the name ${listName}`);
        res.status(200).body(`List already exists with the name ${listName}`);
    } else {
        res.sendStatus(201);
    }
});