export class List {
    _id:string;
    alias: string;
    private privateList: boolean;
    private items: ListEntry[];

    constructor(listName: string, privateList:boolean) {
        this.alias=listName;
        this.privateList=privateList;
    }

    addListItem(item: string): void {
        const listItem = {
            _id: null,
            title: item
        };

        this.items.push(listItem);
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

export interface ListEntry {
    _id: string;
    title: string;
}