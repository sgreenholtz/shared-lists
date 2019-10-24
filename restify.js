const restify = require('restify');

function respond(req,res,next) {
    res.send('hello ' + req.params.name);
    next();
}

const server = restify.createServer();
server.get('/list/:name',respond);
server.listen(8080, ()=> { console.log('%s listening at %s', server.name, server.url) });