import { GuestActionTypes } from '../actions/guests.js';
import { GroupActionTypes } from '../actions/groups.js';
import Utils from '../../utils/utils.js'

const addGuest = (guestsList, action) => {
    const newGuest = {
        id: Utils.generateId(),
        firstName: action.guest.firstName,
        lastName: action.guest.lastName,
        sex: action.guest.sex,
        groupId: action.guest.groupId
    }
    return [...guestsList, newGuest];
}

const editGuest = (guestsList, action) => {
    const index = guestsList.findIndex(guest => action.guest.id === guest.id);
    if (index > -1) {
        const guest = {
            id: action.guest.id,
            firstName: action.guest.firstName,
            lastName: action.guest.lastName,
            sex: action.guest.sex,
            groupId: action.guest.groupId
        }
        return Utils.setAtIndex(guestsList, index, guest)
    } else {
        console.warn("Cannot find guest to edit, ignoring: ", JSON.stringify(action));
        return guestsList;
    }
}

const deleteGuest = (guestsList, action) => {
    const index = guestsList.findIndex(guest => action.guestId === guest.id);
    if (index > -1) {
        return Utils.deleteAtIndex(guestsList, index);
    } else {
        console.warn("Cannot find guest to delete, ignoring: " + JSON.stringify(action));
    }
}

const deleteGroup = (guestsList, action) => {
    return guestsList.map(guest => {
        if (guest.groupId === action.groupId) {
            return {...guest, groupId: null};
        } else {
            return guest;
        }
    });
}

const guestsReducer = (guestsList = [], action) => {
    switch (action.type) {
        case (GuestActionTypes.ADD_GUEST):
            return addGuest(guestsList, action);
        case (GuestActionTypes.EDIT_GUEST):
            return editGuest(guestsList, action)
        case (GuestActionTypes.DELETE_GUEST):
            return deleteGuest(guestsList, action);
        case (GroupActionTypes.DELETE_GROUP):
            return deleteGroup(guestsList, action);
        default:
            return guestsList;
    }
};

export default guestsReducer;