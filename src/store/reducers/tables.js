import { TableActionTypes } from '../actions/tables.js';
import Utils from '../../utils/utils.js'
import {copyItem, deleteItem} from './utils.js'

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
    const index = tablesList.findIndex(table => action.table.id === table.id);
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
    return copyItem(tablesList, action.tableId, "table");
}

const deleteTable = (tablesList, action) => {
    return deleteItem(tablesList, action.tableId, "table");
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