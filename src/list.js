"use strict";
exports.__esModule = true;
var List = /** @class */ (function () {
    function List(listName, privateList) {
        this.alias = listName;
        this.privateList = privateList;
        this.id = null;
    }
    List.prototype.removeListItem = function (id) {
        this.items = this.items.filter(function (element) {
            return element.id != id;
        });
    };
    List.prototype.isListPrivate = function () {
        return this.privateList;
    };
    List.prototype.setId = function (id) {
        this.id = id;
    };
    return List;
}());
exports.List = List;
function addListItem(list, item) {
    var listItem = {
        id: null,
        title: item
    };
    list.items.push(listItem);
    return list;
}
exports.addListItem = addListItem;
