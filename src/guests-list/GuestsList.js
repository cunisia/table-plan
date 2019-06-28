import React from 'react';
import _ from 'lodash';

const NEW_GUEST_ID = "NEW_GUESS";

const GENDER = {
    MALE: 'M',
    FEMALE: 'F'
}

/**
 * Return true if str is empty or blank
 * @param str
 * @returns {boolean|*}
 */
function isEmptyString(str) {
    return _.isEmpty(_.trim(str));
}

/**
 * Replace item at index into array by element. Does not mutate the original array, returns a new one.
 * @param array: array in which the replacement is performed
 * @param index: index of the item which will be replaced
 * @param element: element that will replace the item currently at index in array
 * @returns {[*]}: a new Array in which item at index is element
 */
function setAtIndex(array, index, element) {
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
function deleteAtIndex(array, index) {
    let newArray = [...array]; //let's not mutate the original array
    newArray.splice(index, 1);
    return newArray;
}

function GuestLine(props) {
    return (
        <tr>
            <td>{props.guest.firstName}</td>
            <td>{props.guest.lastName}</td>
            <td>{props.guest.sexe}</td>
            <td>
                <button type="button" onClick={_ => props.onEdit(props.guest.id)}>Edit</button>
                <button type="button" onClick={_ => props.onDelete(props.guest.id)}>Delete</button>
            </td>
        </tr>
    );
}

class EditedGuestLine extends React.Component {
    constructor(props) {
        super(props);
        let guest = _.clone(this.props.guest);
        for (const attr in guest) {
            if (guest[attr] === null) {
                if (attr === 'sexe') {
                    guest[attr] = GENDER.MALE;
                } else {
                    guest[attr] = '';
                }
            }
        }
        this.state = {
            guest: guest
        };
    }

    handleChange(attribute, event) {
        let guest = {...this.state.guest};
        guest[attribute] = event.target.value;
        this.setState({guest: guest});
    }

    save() {
        for (const attr in this.state.guest) {
            if (isEmptyString(this.state.guest[attr])) {
                this.state.guest[attr] = null;
            }
        }
        this.props.onSave(this.state.guest);
    }

    render() {
        return (
            <tr>
                <td><input value={this.state.guest.firstName} onChange={e => this.handleChange('firstName', e)} ref={e => this.toFocus = e}/></td>
                <td><input value={this.state.guest.lastName} onChange={e => this.handleChange('lastName', e)} /></td>
                <td>
                    <select value={this.state.guest.sexe} onChange={e => this.handleChange('sexe', e)}>
                        <option value={GENDER.MALE}>Male</option>
                        <option value={GENDER.FEMALE}>Female</option>
                    </select>
                </td>
                <td>
                    <button type="submit" onClick={_ => this.save()}>Ok</button> {/*TODO: add form validation*/}
                    <button type="button" onClick={_ => this.props.onCancel()}>Cancel</button>
                </td>
            </tr>
        );
    }

    componentDidMount() {
        if (this.toFocus) this.toFocus.focus();
    }
}

export default class GuestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            guestList: [],
            editedGuestId: null
        };
        this.cancelCurrentEdition = this.cancelCurrentEdition.bind(this);
        this.saveCurrentEdition = this.saveCurrentEdition.bind(this);
        this.editGuest = this.editGuest.bind(this);
        this.deleteGuest = this.deleteGuest.bind(this);
    }

    /*
        CRUD
     */

    saveCurrentEdition(guest) {
        const index = this.state.guestList.findIndex(g => g.id === guest.id);
        if (guest.id === NEW_GUEST_ID) {
            guest.id = Math.floor(Math.random() * Math.floor(1000000000));
        }
        if (index > -1) {
            this.setState({
                guestList: setAtIndex(this.state.guestList, index, guest),
                editedGuestId: null
            });
        } else {
            console.warn("Cannot find guest to save, ignoring: ", guest.id);
        }
        this.focusAddGuestButton();
    }

    cancelCurrentEdition() {
        let state = {editedGuestId: null};
        if (this.state.editedGuestId === NEW_GUEST_ID) {
            const index = this.state.guestList.findIndex(g => g.id === NEW_GUEST_ID);
            state.guestList = deleteAtIndex(this.state.guestList, index);
        }
        this.setState(state);
        this.focusAddGuestButton();
    }

    editGuest(guestId) {
        this.cancelCurrentEdition(); //TODO: warning side effect since it is called as utils too... (not a problem for now)
        this.setState({
            editedGuestId: guestId
        });
    }

    deleteGuest(guestId) {
        this.cancelCurrentEdition();
        const index = this.state.guestList.findIndex(guest => guest.id === guestId);
        if (index > -1) {
            this.setState({
                guestList: deleteAtIndex(this.state.guestList, index)
            })
        } else {
            console.warn("Cannot find guest to delete, ignoring: ", guestId);
        }
    }

    addGuest() {
        this.cancelCurrentEdition();
        const newGuest = {
            id: NEW_GUEST_ID,
            firstName: null,
            lastName: null,
            sexe: null
        }
        const guestList = [...this.state.guestList, newGuest];
        this.setState({
            guestList: guestList,
            editedGuestId: NEW_GUEST_ID
        })
    }

    /*
        VIEW
     */

    focusAddGuestButton() {
        if (this.addGuestBtn) this.addGuestBtn.focus();
    }

    renderGuestList() {
        console.log(this.state.guestList);
        return this.state.guestList.map(guest => {
            if (guest.id === this.state.editedGuestId) {
                return (
                    <EditedGuestLine key={guest.id} guest={guest} onSave={this.saveCurrentEdition} onCancel={this.cancelCurrentEdition}/>
                )
            } else {
                return (
                    <GuestLine key={guest.id} guest={guest} onEdit={this.editGuest} onDelete={this.deleteGuest}/>
                )
            }
        })
    }

    render() {
        return (
            <section>
                <h1>Guest List</h1>
                <form>
                    <table>
                        <thead>
                            <tr>
                                <td>Fist Name</td>
                                <td>Last Name</td>
                                <td>Sexe</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderGuestList()}
                        </tbody>
                    </table>
                    <button type="button" onClick={_ => this.addGuest()} ref={e => this.addGuestBtn = e}>Add Guest</button>
                </form>
            </section>
        );
    }
}
