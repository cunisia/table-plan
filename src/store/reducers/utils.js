import Utils from '../../utils/utils.js'

export function copyItem(itemsList, itemId, itemType) {
    const index = itemsList.findIndex(item => itemId === item.id);
    if (index > -1) {
        const itemToCopy = itemsList[index];
        let newItem = {...itemToCopy};
        newItem.id = Utils.generateId();
        return Utils.insertAtIndex(itemsList, index+1, newItem);
    } else {
        console.warn("Cannot find " + (itemType ? itemType : 'item') + " to copy, ignoring: ", itemId);
        return itemsList;
    }
}

export function deleteItem(itemsList, itemId, itemType) {
    const index = itemsList.findIndex(item => itemId === item.id);
    if (index > -1) {
        return Utils.deleteAtIndex(itemsList, index);
    } else {
        console.warn("Cannot find " + (itemType ? itemType : 'item') + " item to delete, ignoring: " + itemId);
    }
}