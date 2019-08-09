export const GuestActionTypes = {
    ADD_GUEST: 'ADD_GUEST',
    DELETE_GUEST: 'DELETE_GUEST',
    EDIT_GUEST: 'EDIT_GUEST',
    COPY_GUEST: 'COPY_GUEST'
};

export const addGuest = (guest) => ({
    type: GuestActionTypes.ADD_GUEST,
    guest
});

export const deleteGuest = (guestId) => ({
    type: GuestActionTypes.DELETE_GUEST,
    guestId
});

export const editGuest = (guest) => ({
    type: GuestActionTypes.EDIT_GUEST,
    guest
});

export const copyGuest = (guestId) => ({
    type: GuestActionTypes.COPY_GUEST,
    guestId
});