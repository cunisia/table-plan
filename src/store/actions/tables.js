export const TableActionTypes = {
    ADD_TABLE: 'ADD_TABLE',
    DELETE_TABLE: 'DELETE_TABLE',
    COPY_TABLE: 'COPY_TABLE',
    EDIT_TABLE: 'EDIT_TABLE'
};

export const addTable = (table) => ({
    type: TableActionTypes.ADD_TABLE,
    table
});

export const deleteTable = (tableId) => ({
    type: TableActionTypes.DELETE_TABLE,
    tableId
});

export const copyTable = (tableId) => ({
    type: TableActionTypes.COPY_TABLE,
    tableId
});

export const editTable = (table) => ({
    type: TableActionTypes.EDIT_TABLE,
    table
});