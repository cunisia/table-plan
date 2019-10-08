import React from 'react';
import {Container, Table, Header, Button, Icon} from 'semantic-ui-react';

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
        this.editGuest = this.editGuest.bind(this);
    }

    /*
        GUEST CRUD
     */

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
                                   onCancel={this.removeGuestForm}
                                   onSave={this.removeGuestForm}/>
                )
            } else {
                return (
                    <GuestLine key={guest.id}
                               guest={guest}
                               onEdit={this.editGuest}
                               onCopy={this.removeGuestForm}
                               onDelete={this.removeGuestForm}/>
                )
            }
        })
    }

    renderNewGuestForm() {
        if (this.state.newGuest !== null) {
            return (
                <GuestLineForm key={this.state.newGuest.id}
                    guest={this.state.newGuest}
                    onCancel={this.removeGuestForm}
                    onAddGroup={this.addGroup}
                    onSave={this.removeGuestForm}/>
            )
        }
    }

    render() {
        return (
            <Container as="section">
                <Header as="h1">Guest List</Header>
                <form>
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Fist Name</Table.HeaderCell>
                                <Table.HeaderCell>Last Name</Table.HeaderCell>
                                <Table.HeaderCell>Sexe</Table.HeaderCell>
                                <Table.HeaderCell>Group</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body id="guest-list__body">
                            {this.renderGuestList()}
                            {this.renderNewGuestForm()}
                        </Table.Body>
                    </Table>
                    <Button
                        primary
                        id="guest-list__add-guest"
                        type="button"
                        onClick={_ => this.addGuest()}
                        ref={e => this.addGuestBtn = e}>
                            <Icon name='plus' />
                            Add Guest
                    </Button>
                </form>
            </Container>
        );
    }
}
