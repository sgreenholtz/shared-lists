const expect = require('chai').expect;
const {describe, before, afterEach, it} = require('mocha');
const {ListRepositoryImpl} = require('../dist/list-repo-sqlite');
const Database = require('better-sqlite3');
const fs = require('fs');

describe('ListRepositoryImpl tests', ()=>{
    const testDatabaseFile = __dirname + '/test.db';
    console.log(testDatabaseFile);
    const repo = new ListRepositoryImpl({debug:true, dbCustomLocation:testDatabaseFile});
    const db = new Database(testDatabaseFile);

    before(cleanDb);

    describe('#createNewList()',()=>{
        it('create and return new list',()=>{
            const name = 'testList';
            const isPrivate = true;
            const listResult = repo.createNewList(name,isPrivate);
            expect(listResult).to.not.equal(null);
            expect(listResult.alias).to.equal(name);
            expect(listResult.privateList).to.equal(isPrivate);
            expect(listResult.id).to.not.equal(null);
        });
    });
    describe('#createNewList()',()=>{
        it('return NULL if list name is already used',()=>{
            const name = 'test-private-unsynced';
            const isPrivate = true;
            const listResult = repo.createNewList(name,isPrivate);
            expect(listResult).to.equal(null);
        });
    });

    describe('#addListItem()', ()=>{
        it('create and return added list item', ()=>{
            const listId = 1;
            const listItem = 'newly-created-list-item';
            const result = repo.addListItem(listId, listItem);
            expect(result).to.not.equal(null);
            expect(result.title).to.equal(listItem);
            expect(result.id).to.not.equal(null);
        });
    });
    describe('#addListItem()', ()=>{
        it('return NULL if list item requested add for a list that doesn\'t exist', ()=>{
            const listId = 10;
            const listItem = 'newly-created-list-item';
            const result = repo.addListItem(listId, listItem);
            expect(result).to.equal(null);
        });
    });

    describe('#listExists()', ()=>{
        it('returns TRUE if list exists', ()=>{
            const listName = 'test-private-unsynced';
            const result = repo.listExists(listName);
            expect(result).to.equal(true);
        });
    });
    describe('#listExists()', ()=>{
        it('returns FALSE if list does not exist', ()=>{
            const listName = 'test-thislistdoesntexist';
            const result = repo.listExists(listName);
            expect(result).to.equal(false);
        });
    });

    describe('#completeListItem()',()=>{
        it('returns TRUE if the list item is "completed" AKA deleted', ()=>{
            const result = repo.completeListItem(1,1);
            expect(result).to.equal(true);
        });
    });
    describe('#completeListItem()',()=>{
        it('returns FALSE if the list item doesn\t exist', ()=>{
            const result = repo.completeListItem(1,10);
            expect(result).to.equal(false);
        });
    });

    describe('#deleteList()',()=>{
        it('returns TRUE if the list is deleted successfully',()=>{
            const result = repo.deleteList(1);
            expect(result).to.equal(true);
        });
    });
    describe('#deleteList()',()=>{
        it('returns FALSE if the list doesn\'t exist',()=>{
            const result = repo.deleteList(10);
            expect(result).to.equal(false);
        });
    });

    describe('#clearList()',()=>{
        it('returns TRUE if all the list items are deleted',()=>{
            const result = repo.clearList(1);
            expect(result).to.equal(true);
        });
    });
    describe('#clearList()',()=>{
        it('returns FALSE if the list does\'t exist',()=>{
            const result = repo.clearList(10);
            expect(result).to.equal(false);
        });
    });

    describe('#getList()',()=>{
        it('returns the list specified by the given list name',()=>{
            const listName = 'test-public-unsynced';
            const result = repo.getList(listName);
            expect(result).to.not.equal(null);
            expect(result.alias).to.equal(listName);
            expect(result.id).to.not.equal(null);
        });
    });
    describe('#getList()',()=>{
        it('returns NULL if the list specified by the given name doesn\'t exist',()=>{
            const listName = 'test-thislistdoesntexist';
            const result = repo.getList(listName);
            expect(result).to.equal(null);
        });
    });

    afterEach(cleanDb);

    function cleanDb() {
        db.exec(fs.readFileSync('/home/sgreenholtz/workspaces/shared-lists/test/test.db.down.sql','utf8'));
        db.exec(fs.readFileSync('/home/sgreenholtz/workspaces/shared-lists/test/test.db.up.sql','utf8'));
    }
});

