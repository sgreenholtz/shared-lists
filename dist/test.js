"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const list_repo_sqlite_1 = require("./list-repo-sqlite");
const listRepository = new list_repo_sqlite_1.ListRepositoryImpl();
const listCreate = listRepository.createNewList('test1', false);
console.log(listCreate);
//# sourceMappingURL=test.js.map