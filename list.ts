export class List {
    _id:string;
    alias: string;
    private privateList: boolean;
    items: ListEntry[];

    constructor(listName: string, privateList:boolean) {
        this.alias=listName;
        this.privateList=privateList;
    }

    removeListItem(id: string): void {
        this.items = this.items.filter((element)=>{
            return element._id!=id;
        })
    }

    isListPrivate(): boolean {
        return this.privateList;
    }
}

export function addListItem(list:List, item: string): List {
    const listItem = {
        _id: null,
        title: item
    };

    list.items.push(listItem);
    return list;
}

export interface ListEntry {
    _id: string;
    title: string;
}