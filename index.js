"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var port = 3000;
app.get('/list', function (req, res) { res.send('This is the shared list API'); });
app.listen(port, function () { console.log("Listening on " + port); });
