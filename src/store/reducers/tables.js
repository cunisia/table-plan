import { TableActionTypes } from '../actions/tables.js';
import Utils from '../../utils/utils.js'

const addTable = (tablesList, action) => {
    const newTable = {
        id: Utils.generateId(),
        name: action.table.name,
        isCircle: action.table.isCircle,
        seatsWidth: action.table.seatsWidth,
        seatsHeight: action.table.seatsHeight
    }
    return [...tablesList, newTable];
}

const editTable = (tablesList, action) => {
    const index = tablesList.findIndex(table => action.tableId === table.tableId);
    if (index > -1) {
        const table = {
            id: action.table.id,
            name: action.table.name,
            isCircle: action.table.isCircle,
            seatsWidth: action.table.seatsWidth,
            seatsHeight: action.table.seatsHeight
        }
        return Utils.setAtIndex(tablesList, index, table)
    } else {
        console.warn("Cannot find table to edit, ignoring: ", JSON.stringify(action));
        return tablesList;
    }
}

const copyTable = (tablesList, action) => {
    const index = tablesList.findIndex(table => action.tableId === table.id);
    if (index > -1) {
        const tableToCopy = tablesList[index];
        let newTable = {...tableToCopy};
        newTable.id = Utils.generateId();
        return Utils.insertAtIndex(tablesList, index+1, newTable);
    } else {
        console.warn("Cannot find table to copy, ignoring: ", JSON.stringify(action));
        return tablesList;
    }
}

const deleteTable = (tablesList, action) => {
    const index = tablesList.findIndex(table => action.tableId === table.id);
    if (index > -1) {
        return Utils.deleteAtIndex(tablesList, index);
    } else {
        console.warn("Cannot find table to delete, ignoring: " + JSON.stringify(action));
    }
}

const tablesReducer = (tablesList = [], action) => {
    switch (action.type) {
        case (TableActionTypes.ADD_TABLE):
            return addTable(tablesList, action);
        case (TableActionTypes.EDIT_TABLE):
            return editTable(tablesList, action)
        case (TableActionTypes.COPY_TABLE):
            return copyTable(tablesList, action);
        case (TableActionTypes.DELETE_TABLE):
            return deleteTable(tablesList, action);
        default:
            return tablesList;
    }
};

export default tablesReducer;