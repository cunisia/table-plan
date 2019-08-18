import Const from '../utils/const.js';
import Utils from '../utils/utils.js';
import GuestUtils from '../guests-list/GuestUtils.js';

function getModalVerb(constraint) {
    return constraint.affirmative ? "must" : "must not";
}

function getGuestsLabel(constraint, guestsList) {
    return constraint.guestsIdList
        .map(guestId => {
            const guest = Utils.getById(guestsList, guestId);
            return guest ? GuestUtils.getGuestFullName(guest) : guestId;
        })
        .reduce((accumulator, guestFullName) => accumulator + guestFullName + ', ', '');
}

function getGroupsLabel(constraint, groupsList) {
    return constraint.groupsIdList
        .map(groupId => {
            const group = Utils.getById(groupsList, groupId);
            return group ? group.name : groupId;
        })
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
                const table = constraint.tablesIdList.length >= 1 ? Utils.getById(tablesList, constraint.tablesIdList[0]) : null;
                const tableName = table ? table.name : constraint.tablesIdList.length >= 1 ? constraint.tablesIdList[0] : "";
                return (getGroupsLabel(constraint, groupsList) + getGuestsLabel(constraint, guestsList))
                    .concat(getModalVerb(constraint) + " ")
                    .concat(Const.CONSTRAINTS_LABEL[constraint.type] + " ")
                    .concat(tableName);
            default:
                console.warn("Constraint of unknown type, ignoring: ", JSON.stringify(constraint));
                return null;
        }
    },
    isConstraintValid(constraint) {
        switch (constraint.type) {
            case Const.CONSTRAINTS.BE_NEXT_TO:
            case Const.CONSTRAINTS.SEAT_AT_SAME_TABLE:
            case Const.CONSTRAINTS.SEAT_AT_SPECIFIC_TABLE:
                return constraint.tablesIdList.length + constraint.guestsIdList.length + constraint.groupsIdList.length > 1;
            case Const.CONSTRAINTS.HAVE_EXCLUSIVE_TABLE:
            case Const.CONSTRAINTS.HAVE_GROUP_EXCLUSIVE_TABLE:
                return constraint.tablesIdList.length + constraint.guestsIdList.length + constraint.groupsIdList.length > 0;
            default:
                console.warn("Unknown generic constraint, cannot say if its valid: " + JSON.stringify(constraint))
                return true;
        }
    }
}

export default ConstraintUtils;