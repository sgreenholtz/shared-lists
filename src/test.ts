import {ListRepositoryImpl} from './list-repo-sqlite';

const listRepository = new ListRepositoryImpl();

const listCreate = listRepository.createNewList('test1', false);
console.log(listCreate);