import _ from 'lodash';

class Utils {
    /**
     * Return true if str is empty or blank
     * @param str
     * @returns {boolean|*}
     */
    isEmptyString(str) {
        return _.isEmpty(_.trim(str));
    }

    /**
     * Replace item at index into array by element. Does not mutate the original array, returns a new one.
     * @param array: array in which the replacement is performed
     * @param index: index of the item which will be replaced
     * @param element: element that will replace the item currently at index in array
     * @returns {[*]}: a new Array in which item at index is element
     */
    setAtIndex(array, index, element) {
        let newArray = [...array]; //let's not mutate the original array
        newArray[index] = element;
        return newArray;
    }

    /**
     * Delete item at index into array. Does not mutate the original array, returns a new one.
     * @param array: array in which the deletion is performed
     * @param index: index of the item which will be deleted
     * @returns {[*]}: a new Array of length decremented of one
     */
    deleteAtIndex(array, index) {
        let newArray = [...array]; //let's not mutate the original array
        newArray.splice(index, 1);
        return newArray;
    }

    insertAtIndex(array, index, element) {
        if (index < array.length) {
            return [...array.slice(0, index), element, ...array.slice(index)];
        } else if (index === array.length) {
            return [...array, element];
        }
        console.warn("Cannot insert at index because index greater than array's length, ignoring");
    }

    generateId() {
        return Math.floor(Math.random() * Math.floor(1000000000));
    }

    getById(list, id) {
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (element.id == id) { //TODO: replace all IDs by string so that we can use a === easily here
                return element;
            }
        }
        console.warn("Could not find element in list, returning null: id = " + id + ", list = ", JSON.stringify(list));
        return null;
    }
}

export default new Utils();