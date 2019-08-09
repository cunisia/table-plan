import { ConstraintActionTypes } from '../actions/constraints.js';
import Utils from '../../utils/utils.js'

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
        tablesIdList: action.constraint.tablesIdList
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
            tablesIdList: action.constraint.tablesIdList
        }
        return Utils.setAtIndex(constraintsList, index, constraint)
    } else {
        console.warn("Cannot find constraint to edit, ignoring: ", JSON.stringify(action));
        return constraintsList;
    }
}

const copyConstraint = (constraintsList, action) => {
    const index = constraintsList.findIndex(constraint => action.constraintId === constraint.id);
    if (index > -1) {
        const constraintToCopy = constraintsList[index];
        let newConstraint = {...constraintToCopy};
        newConstraint.id = Utils.generateId();
        console.log(JSON.stringify(newConstraint));
        return Utils.insertAtIndex(constraintsList, index+1, newConstraint);
    } else {
        console.warn("Cannot find constraint to copy, ignoring: ", JSON.stringify(action));
        return constraintsList;
    }
}

const deleteConstraint = (constraintsList, action) => {
    const index = constraintsList.findIndex(constraint => action.constraintId === constraint.id);
    if (index > -1) {
        return Utils.deleteAtIndex(constraintsList, index);
    } else {
        console.warn("Cannot find constraint to delete, ignoring: " + JSON.stringify(action));
    }
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
        default:
            return constraints;
    }
};

export default constraintsReducer;