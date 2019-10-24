"use strict";
exports.__esModule = true;
var List = /** @class */ (function () {
    function List(listName, privateList) {
        this.alias = listName;
        this.privateList = privateList;
    }
    List.prototype.removeListItem = function (id) {
        this.items = this.items.filter(function (element) {
            return element._id != id;
        });
    };
    List.prototype.isListPrivate = function () {
        return this.privateList;
    };
    return List;
}());
exports.List = List;
function addListItem(list, item) {
    var listItem = {
        _id: null,
        title: item
    };
    list.items.push(listItem);
    return list;
}
exports.addListItem = addListItem;
