class Const {
    constructor() {
        this.NEW_GUEST_ID = "NEW_GUESS";
        this.NEW_GROUP_OPT = "NEW_GROUP_OPT";
        this.NEW_TABLE_ID = "NEW_TABLE";
        this.NEW_CONSTRAINT_ID = "NEW_CONSTRAINT";

        this.GENDER = {
            MALE: 'M',
            FEMALE: 'F'
        };

        this.CONSTRAINTS = {
            BE_NEXT_TO: "BE_NEXT_TO",
            SEAT_AT_SAME_TABLE: "SEAT_AT_SAME_TABLE",
            SEAT_AT_SPECIFIC_TABLE: "SEAT_AT_SPECIFIC_TABLE",
            HAVE_EXCLUSIVE_TABLE: "HAVE_EXCLUSIVE_TABLE",
            HAVE_GROUP_EXCLUSIVE_TABLE: "HAVE_GROUP_EXCLUSIVE_TABLE"
        }

        this.CONSTRAINTS_LABEL = {};
        this.CONSTRAINTS_LABEL[this.CONSTRAINTS.BE_NEXT_TO] = "be next to each other";
        this.CONSTRAINTS_LABEL[this.CONSTRAINTS.SEAT_AT_SAME_TABLE] = "seat at the same table";
        this.CONSTRAINTS_LABEL[this.CONSTRAINTS.SEAT_AT_SPECIFIC_TABLE] = "seat at table";
        this.CONSTRAINTS_LABEL[this.CONSTRAINTS.HAVE_EXCLUSIVE_TABLE] = "have an exclusive table";
        this.CONSTRAINTS_LABEL[this.CONSTRAINTS.HAVE_GROUP_EXCLUSIVE_TABLE] = "have an exclusive to other groups table";
    }
}

export default Object.freeze(new Const());
