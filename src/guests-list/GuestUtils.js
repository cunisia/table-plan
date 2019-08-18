const GuestUtils = {
    getGuestFullName(guest) {
        let name = "";
        if (guest.firstName) {
            name += guest.firstName;
        }
        if (guest.lastName) {
            name += guest.firstName ? " " + guest.lastName : guest.lastName;
        }
        return name;
    }
}

export default GuestUtils;