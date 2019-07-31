import React from 'react';
import Const from '../utils/const.js';
import GuestLineForm from './GuestLineForm.js';
import GuestLine from './GuestLine.js';

export default class GuestList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newGuest: null,
            editedGuestId: null
        };
        this.removeGuestForm = this.removeGuestForm.bind(this);
        this.saveGuest = this.saveGuest.bind(this);
        this.editGuest = this.editGuest.bind(this);
        this.deleteGuest = this.deleteGuest.bind(this);
        this.addGroup = this.addGroup.bind(this);
    }

    /*
        GUEST CRUD
     */

    saveGuest(guest) {
        if (guest.id === Const.NEW_GUEST_ID) {
            this.props.addGuest(guest);
        } else {
            this.props.editGuest(guest);
        }
        this.removeGuestForm();
    }

    removeGuestForm() {
        this.setState({
            newGuest: null,
            editedGuestId: null
        });
        this.focusAddGuestButton();
    }

    async editGuest(guestId) {
        await this.removeGuestForm(); //TODO: warning side effect since it is called as utils too... (not a problem for now)
        this.setState({
            editedGuestId: guestId
        });
    }

    async deleteGuest(guestId) {
        await this.removeGuestForm();
        this.props.deleteGuest(guestId);
    }

    async addGuest() {
        await this.removeGuestForm();
        const newGuest = {
            id: Const.NEW_GUEST_ID,
            firstName: null,
            lastName: null,
            sex: null,
            groupId: null
        }
        this.setState({
            newGuest: newGuest
        })
    }

    /*
        GROUP CRUD
     */

    addGroup(group) {
        this.props.addGroup(group);
    }

    /*
        VIEW
     */

    focusAddGuestButton() {
        if (this.addGuestBtn) this.addGuestBtn.focus();
    }

    renderGuestList() {
        return this.props.guestsList.map(guest => {
            if (guest.id === this.state.editedGuestId) {
                return (
                    <GuestLineForm key={guest.id}
                                   guest={guest}
                                   groupsList={this.props.groupsList}
                                   onSave={this.saveGuest}
                                   onCancel={this.removeGuestForm}
                                   onAddGroup={this.addGroup} />
                )
            } else {
                return (
                    <GuestLine key={guest.id}
                               guest={guest}
                               groupsList={this.props.groupsList}
                               onEdit={this.editGuest}
                               onDelete={this.deleteGuest}/>
                )
            }
        })
    }

    renderNewGuestForm() {
        if (this.state.newGuest !== null) {
            return (
                <GuestLineForm key={this.state.newGuest.id}
                    guest={this.state.newGuest}
                    groupsList={this.props.groupsList}
                    onSave={this.saveGuest}
                    onCancel={this.removeGuestForm}
                    onAddGroup={this.addGroup} />
            )
        }
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
                        <tbody id="guest-list__body">
                            {this.renderGuestList()}
                            {this.renderNewGuestForm()}
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
