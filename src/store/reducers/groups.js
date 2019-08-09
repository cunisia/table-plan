import { GroupActionTypes } from '../actions/groups.js';
import Utils from '../../utils/utils.js';
import {deleteItem} from './utils.js'

const addGroup = (groupsList, action) => {
    return [...groupsList, action.group];
}

const editGroup = (groupsList, action) => {
    const index = groupsList.findIndex(group => action.id === group.id);
    if (index > -1) {
        const group = {
            id: action.id,
            name: action.name,
        }
        return Utils.setAtIndex(groupsList, index, group)
    } else {
        console.warn("Cannot find group to edit, ignoring: ", JSON.stringify(action));
        return groupsList;
    }
}

const deleteGroup = (groupsList, action) => {
    return deleteItem(groupsList, action.groupId);
}

const groupsReducer = (groupsList = [], action) => {
    switch (action.type) {
        case (GroupActionTypes.ADD_GROUP):
            return addGroup(groupsList, action);
        case (GroupActionTypes.EDIT_GROUP):
            return editGroup(groupsList, action)
        case (GroupActionTypes.DELETE_GROUP):
            return deleteGroup(groupsList, action);
        default:
            return groupsList;
    }
};

export default groupsReducer;
