import { ConstraintActionTypes } from '../actions/constraints.js';
import { TableActionTypes } from '../actions/tables.js';
import { GuestActionTypes } from '../actions/guests.js';
import { GroupActionTypes } from '../actions/groups.js';
import Utils from '../../utils/utils.js'
import Const from '../../utils/const.js'
import {copyItem, deleteItem} from './utils.js'
import ConstraintUtils from '../../constraints-list/ConstraintUtils';

const defaultConstraints = {
    list: [],
    generic: {
        seatGroupsTogether: true,
        exclusiveGroups: false,
        exclusiveGroupsToGroups: true,
        alternateSex: false
    }
}

const addConstraint = (constraintsList, action) => {
    const newConstraint = {
        id: Utils.generateId(),
        type: action.constraint.type,
        affirmative: action.constraint.affirmative,
        guestsIdList: action.constraint.guestsIdList,
        groupsIdList: action.constraint.groupsIdList,
        tablesIdList: filterTablesIdListByConstraintType(action.constraint.type, action.constraint.tablesIdList)
    }
    return [...constraintsList, newConstraint];
}

const editConstraint = (constraintsList, action) => {
    const index = constraintsList.findIndex(constraint => action.constraint.id === constraint.id);
    if (index > -1) {
        const constraint = {
            id: action.constraint.id,
            type: action.constraint.type,
            affirmative: action.constraint.affirmative,
            guestsIdList: action.constraint.guestsIdList,
            groupsIdList: action.constraint.groupsIdList,
            tablesIdList: filterTablesIdListByConstraintType(action.constraint.type, action.constraint.tablesIdList)
        }
        return Utils.setAtIndex(constraintsList, index, constraint)
    } else {
        console.warn("Cannot find constraint to edit, ignoring: ", JSON.stringify(action));
        return constraintsList;
    }
}

const filterTablesIdListByConstraintType = (constraintType, tablesIdList) => {
    switch (constraintType) {
        case Const.CONSTRAINTS.BE_NEXT_TO:
        case Const.CONSTRAINTS.SEAT_AT_SAME_TABLE:
        case Const.CONSTRAINTS.HAVE_EXCLUSIVE_TABLE:
        case Const.CONSTRAINTS.HAVE_GROUP_EXCLUSIVE_TABLE:
            return [];
        case Const.CONSTRAINTS.SEAT_AT_SPECIFIC_TABLE:
            return tablesIdList.length > 0 ? [tablesIdList[0]] : [];
        default:
            console.warn("Unknown constraint type, returning unfiltered tablesIdList: ", constraintType);
    }
}

const copyConstraint = (constraintsList, action) => {
    return copyItem(constraintsList, action.constraintId, "constraint");
}

const deleteConstraint = (constraintsList, action) => {
    return deleteItem(constraintsList, action.constraintId, "constraint");
}

const editGenericConstraint = (constraintsGeneric, action) => {
    let newConstraintsGeneric = {...constraintsGeneric};
    if (typeof(newConstraintsGeneric[action.attribute] !== null)) {
        newConstraintsGeneric[action.attribute] = action.value;
    } else {
        console.warn("Unknown generic constraint, ignoring: " + JSON.stringify(action))
    }
    return newConstraintsGeneric;
}

const deleteFromIdList = (constraintsList, idListName, idToDelete) => {
    return constraintsList
        .map(constraint => {
            let newConstraint = {...constraint};
            newConstraint[idListName] = (constraint[idListName]).filter(id => id != idToDelete) //TODO: replace all IDs by string so that we can use a === easily here
            return newConstraint;
        })
        .filter(constraint => {
            return ConstraintUtils.isConstraintValid(constraint);
        });
}

const constraintsReducer = (constraints = defaultConstraints, action) => {
    switch (action.type) {
        case (ConstraintActionTypes.ADD_CONSTRAINT):
            return {list:addConstraint(constraints.list, action), generic: {...constraints.generic}};
        case (ConstraintActionTypes.EDIT_CONSTRAINT):
            return {list: editConstraint(constraints.list, action), generic: {...constraints.generic}};
        case (ConstraintActionTypes.COPY_CONSTRAINT):
            return {list: copyConstraint(constraints.list, action), generic: {...constraints.generic}};
        case (ConstraintActionTypes.DELETE_CONSTRAINT):
            return {list: deleteConstraint(constraints.list, action), generic: {...constraints.generic}};
        case (ConstraintActionTypes.EDIT_GENERIC_CONSTRAINT):
            return {list: [...constraints.list], generic: editGenericConstraint(constraints.generic, action)};
        case (GuestActionTypes.DELETE_GUEST):
            return {list: deleteFromIdList(constraints.list, "guestsIdList", action.guestId), generic: {...constraints.generic}};
        case (TableActionTypes.DELETE_TABLE):
            return {list: deleteFromIdList(constraints.list, "tablesIdList", action.tableId), generic: {...constraints.generic}};
        case (GroupActionTypes.DELETE_GROUP):
            return {list: deleteFromIdList(constraints.list, "groupsIdList", action.groupId), generic: {...constraints.generic}};
        default:
            return constraints;
    }
};

export default constraintsReducer;