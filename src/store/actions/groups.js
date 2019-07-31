export const GroupActionTypes = {
    ADD_GROUP: 'ADD_GROUP',
    DELETE_GROUP: 'DELETE_GROUP',
    EDIT_GROUP: 'EDIT_GROUP'
};

export const addGroup = (group) => ({
    type: GroupActionTypes.ADD_GROUP,
    group
});

export const deleteGroup = (id) => ({
    type: GroupActionTypes.DELETE_GROUP,
    id
});

export const editGroup = (id, name) => ({
    type: GroupActionTypes.EDIT_GROUP,
    id, name
});