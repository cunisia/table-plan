const TableUtils = {
    getShapeLabel (isCircle, seatsWidth, seatsHeight) {
        return isCircle ? "Circle" : "Rectangle (" + seatsWidth + " x " + seatsHeight +" )";
    },

    getNbSeats(isCircle, seatsWidth, seatsHeight) {
        return isCircle ? seatsWidth : 2 * seatsWidth + 2 * seatsHeight;
    }
}

export default TableUtils;