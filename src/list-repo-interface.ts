import {List, ListEntry} from "./list";

export interface ListRepository {
    createNewList(name:string, isPrivate:boolean):List;
    addListItem(listId:string, listItem:string):ListEntry;
    listExists(listName: string):boolean;
    completeListItem(listId: string, listItemId: number): boolean;
    deleteList(listId:string): boolean;
    printAllLists(): void
}