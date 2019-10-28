export class List {
    id:string;
    alias: string;
    private privateList: boolean;
    items: ListEntry[];

    constructor(listName: string, privateList:boolean) {
        this.alias=listName;
        this.privateList=privateList;
        this.id = null;
    }

    removeListItem(id: string): void {
        this.items = this.items.filter((element)=>{
            return element.id!=id;
        })
    }

    isListPrivate(): boolean {
        return this.privateList;
    }
}

export function addListItem(list:List, item: string): List {
    const listItem = {
        id: null,
        title: item
    };

    list.items.push(listItem);
    return list;
}

export interface ListEntry {
    id: string;
    title: string;
}