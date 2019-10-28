"use strict";
exports.__esModule = true;
var list_repo_sqlite_1 = require("./list-repo-sqlite");
var listRepository = new list_repo_sqlite_1.ListRepositoryImpl();
var listCreate = listRepository.createNewList('test1', false);
console.log(listCreate);
