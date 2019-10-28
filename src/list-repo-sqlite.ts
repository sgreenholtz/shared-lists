import {ListRepository} from './list-repo-interface';

export class ListRepositoryImpl implements ListRepository {
    createNewList(name: string, isPrivate: boolean): import("./list").List {
        throw new Error("Method not implemented.");
    }    addListItem(listId: string, listItem: string): import("./list").ListEntry {
        throw new Error("Method not implemented.");
    }
    listExists(listName: string): boolean {
        throw new Error("Method not implemented.");
    }
    completeListItem(listId: string, listItemId: number): boolean {
        throw new Error("Method not implemented.");
    }
    deleteList(listId: string): boolean {
        throw new Error("Method not implemented.");
    }
    printAllLists(): void {
        throw new Error("Method not implemented.");
    }

    
}