import Const from '../utils/const.js';
import Utils from '../utils/utils.js';
import GuestUtils from '../guests-list/GuestUtils.js';

function getModalVerb(constraint) {
    return constraint.affirmative ? "must" : "must not";
}

function getGuestsLabel(constraint, guestsList) {
    return constraint.guestsIdList
        .map(guestId => GuestUtils.getGuestFullName(Utils.getById(guestsList, guestId)))
        .reduce((accumulator, guestFullName) => accumulator + guestFullName + ', ', '');
}

function getGroupsLabel(constraint, groupsList) {
    return constraint.groupsIdList
        .map(groupId => Utils.getById(groupsList, groupId).name)
        .reduce((accumulator, guestFullName) => accumulator + guestFullName + ', ', '');
}

const ConstraintUtils = {
    getLabel(constraint, guestsList, groupsList, tablesList) {
        switch (constraint.type) {
            case (Const.CONSTRAINTS.BE_NEXT_TO):
                return getGuestsLabel(constraint, guestsList)
                    .concat(getModalVerb(constraint) + " ")
                    .concat(Const.CONSTRAINTS_LABEL[constraint.type] + ".");
            case (Const.CONSTRAINTS.HAVE_GROUP_EXCLUSIVE_TABLE):
            case (Const.CONSTRAINTS.HAVE_EXCLUSIVE_TABLE):
                return getGroupsLabel(constraint, groupsList)
                    .concat(getModalVerb(constraint) + " ")
                    .concat(Const.CONSTRAINTS_LABEL[constraint.type] + ".");
            case (Const.CONSTRAINTS.SEAT_AT_SAME_TABLE):
                return (getGroupsLabel(constraint, groupsList) + getGuestsLabel(constraint, guestsList))
                    .concat(getModalVerb(constraint) + " ")
                    .concat(Const.CONSTRAINTS_LABEL[constraint.type] + ".");
            case (Const.CONSTRAINTS.SEAT_AT_SPECIFIC_TABLE):
                return (getGroupsLabel(constraint, groupsList) + getGuestsLabel(constraint, guestsList))
                    .concat(getModalVerb(constraint) + " ")
                    .concat(Const.CONSTRAINTS_LABEL[constraint.type] + " ")
                    .concat(Utils.getById(tablesList, constraint.tablesIdList[0]).name);
            default:
                console.warn("Constraint of unknown type, ignoring: ", JSON.stringify(constraint));
                return null;
        }
    }
}

export default ConstraintUtils;