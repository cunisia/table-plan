import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import CreateGroupModal from './CreateGroupModal.js';
import Utils from '../utils/utils.js';

const NEW_GUEST_ID = "NEW_GUESS";
const NEW_GROUP_OPT = "NEW_GROUP_OPT";

const GENDER = {
    MALE: 'M',
    FEMALE: 'F'
}

function GuestLine(props) {
    return (
        <tr>
            <td>{props.guest.firstName}</td>
            <td>{props.guest.lastName}</td>
            <td>{props.guest.sexe}</td>
            <td>{props.guest.group.name}</td>
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
        this.onAddGroup = this.onAddGroup.bind(this);
        this.removeCreateGroupModal = this.removeCreateGroupModal.bind(this);
    }

    handleChange(attribute, event) {
        let guest = {...this.state.guest};
        guest[attribute] = event.target.value;
        this.setState({guest: guest});
    }

    handleGroupChange(event) {
        if (event.target.value === NEW_GROUP_OPT) {
            /* Summon modal for group creation*/
            ReactDOM.render(<CreateGroupModal onSave={this.onAddGroup} onCancel={this.removeCreateGroupModal}/>, document.getElementById('modalWrapper'));
        } else {
            const group = this.props.groupList.find(group => group.id === parseInt(event.target.value));
            this.setGroup(group);
        }
    }

    onAddGroup(group) {
        this.setGroup(group);
        this.props.onAddGroup(group);
        this.removeCreateGroupModal();
    }

    setGroup(group) {
        let guest = {...this.state.guest};
        guest.group = group;
        this.setState({guest: guest});
    }

    removeCreateGroupModal() {
        ReactDOM.unmountComponentAtNode(document.getElementById('modalWrapper'));
    }

    save() {
        let guest = _.clone(this.state.guest);
        for (const attr in guest) {
            if (Utils.isEmptyString(guest[attr])) {
                guest[attr] = null;
            }
        }
        this.props.onSave(guest);
    }

    /*
        --- RENDERING ---
    */

    renderGroupOptions() {
        return this.props.groupList.map(group => {
            return (
                <option value={group.id}>{group.name}</option>
            )
        })
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
                    <select value={this.state.guest.group.id} onChange={e => this.handleGroupChange(e)}>
                        <option value="">None</option>
                        {this.renderGroupOptions()}
                        <option value={NEW_GROUP_OPT}>New Group</option>
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
            editedGuestId: null,
            groupList: []
        };
        this.cancelCurrentEdition = this.cancelCurrentEdition.bind(this);
        this.saveCurrentEdition = this.saveCurrentEdition.bind(this);
        this.editGuest = this.editGuest.bind(this);
        this.deleteGuest = this.deleteGuest.bind(this);
        this.addGroup = this.addGroup.bind(this);
    }

    /*
        GUEST CRUD
     */

    saveCurrentEdition(guest) {
        const index = this.state.guestList.findIndex(g => g.id === guest.id);
        if (guest.id === NEW_GUEST_ID) {
            guest.id = Utils.generateId();
        }
        if (index > -1) {
            this.setState({
                guestList: Utils.setAtIndex(this.state.guestList, index, guest),
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
            state.guestList = Utils.deleteAtIndex(this.state.guestList, index);
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
                guestList: Utils.deleteAtIndex(this.state.guestList, index)
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
            sexe: null,
            group: null
        }
        const guestList = [...this.state.guestList, newGuest];
        this.setState({
            guestList: guestList,
            editedGuestId: NEW_GUEST_ID
        })
    }

    /*
        GROUP CRUD
     */

    addGroup(group) {
        const groupList = [...this.state.groupList, group];
        this.setState({groupList: groupList});
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
                    <EditedGuestLine key={guest.id}
                                     guest={guest}
                                     groupList={this.state.groupList}
                                     onSave={this.saveCurrentEdition}
                                     onCancel={this.cancelCurrentEdition}
                                     onAddGroup={this.addGroup} />
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
                                <td>Group</td>
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
