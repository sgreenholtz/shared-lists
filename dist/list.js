"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class List {
    constructor(listName, privateList) {
        this.alias = listName;
        this.privateList = privateList;
        this.id = null;
    }
    removeListItem(id) {
        this.items = this.items.filter((element) => {
            return element.id != id;
        });
    }
    isListPrivate() {
        return this.privateList;
    }
    setId(id) {
        this.id = id;
    }
}
exports.List = List;
function addListItem(list, item) {
    const listItem = {
        id: null,
        title: item
    };
    list.items.push(listItem);
    return list;
}
exports.addListItem = addListItem;
//# sourceMappingURL=list.js.map