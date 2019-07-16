import React from 'react';
import Utils from '../utils/utils.js';
import Const from '../utils/const.js';
import GuestLineForm from './GuestLineForm.js';
import GuestLine from './GuestLine.js';

export default class GuestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            guestList: [],
            editedGuestId: null,
            groupList: []
        };
        this.cancelGuestEdition = this.cancelGuestEdition.bind(this);
        this.saveGuest = this.saveGuest.bind(this);
        this.editGuest = this.editGuest.bind(this);
        this.deleteGuest = this.deleteGuest.bind(this);
        this.addGroup = this.addGroup.bind(this);
    }

    /*
        GUEST CRUD
     */

    saveGuest(guest) {
        const index = this.state.guestList.findIndex(g => g.id === guest.id);
        if (guest.id === Const.NEW_GUEST_ID) {
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

    cancelGuestEdition() {
        let state = {editedGuestId: null};
        if (this.state.editedGuestId === Const.NEW_GUEST_ID) {
            const index = this.state.guestList.findIndex(g => g.id === Const.NEW_GUEST_ID);
            state.guestList = Utils.deleteAtIndex(this.state.guestList, index);
        }
        this.setState(state);
        this.focusAddGuestButton();
    }

    async editGuest(guestId) {
        await this.cancelGuestEdition(); //TODO: warning side effect since it is called as utils too... (not a problem for now)
        this.setState({
            editedGuestId: guestId
        });
    }

    async deleteGuest(guestId) {
        await this.cancelGuestEdition();
        const index = this.state.guestList.findIndex(guest => guest.id === guestId);
        if (index > -1) {
            this.setState({
                guestList: Utils.deleteAtIndex(this.state.guestList, index)
            })
        } else {
            console.warn("Cannot find guest to delete, ignoring: ", guestId);
        }
    }

    async addGuest() {
        await this.cancelGuestEdition();
        const newGuest = {
            id: Const.NEW_GUEST_ID,
            firstName: null,
            lastName: null,
            sex: null,
            group: null
        }
        const guestList = [...this.state.guestList, newGuest];
        this.setState({
            guestList: guestList,
            editedGuestId: Const.NEW_GUEST_ID
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
        return this.state.guestList.map(guest => {
            if (guest.id === this.state.editedGuestId) {
                return (
                    <GuestLineForm key={guest.id}
                                   guest={guest}
                                   groupList={this.state.groupList}
                                   onSave={this.saveGuest}
                                   onCancel={this.cancelGuestEdition}
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
                    <button
                        id="guest-list__add-guest"
                        type="button"
                        onClick={_ => this.addGuest()}
                        ref={e => this.addGuestBtn = e}>
                            Add Guest
                    </button>
                </form>
            </section>
        );
    }
}
