import React from 'react';
import {Table, Input, Button, Dropdown} from 'semantic-ui-react';

import { connect } from 'react-redux'
import { addGuest, editGuest } from '../store/actions/guests.js'
import { addGroup } from '../store/actions/groups.js'
import _ from 'lodash';
import CreateGroupModal from './CreateGroupModal.js';
import ModalPortal from '../utils/ModalPortal'
import Utils from '../utils/utils.js';
import Const from '../utils/const.js'


const mapStateToProps = (state) => ({
    groupsList: state.groupsList,
});

const mapDispatchToProps = (dispatch, props) => ({
    onSave: (guest) => {
        if (guest.id === Const.NEW_GUEST_ID) {
            dispatch(addGuest(guest));
        } else {
            dispatch(editGuest(guest));
        }
        props.onSave();
    },
    onAddGroup: (group) => {
        dispatch(addGroup(group));
    }
});

class GuestLineForm extends React.Component {
    constructor(props) {
        super(props);
        let guest = _.clone(this.props.guest);
        for (const attr in guest) {
            if (guest[attr] === null) {
                if (attr === 'sex') {
                    guest[attr] = Const.GENDER.MALE;
                } else {
                    guest[attr] = '';
                }
            }
        }
        this.state = {
            guest: guest,
            displayGroupCreationModal: false
        };
        this.onAddGroup = this.onAddGroup.bind(this);
        this.removeCreateGroupModal = this.removeCreateGroupModal.bind(this);
    }

    handleChange(attribute, data) {
        const {value} = data;
        let guest = {...this.state.guest};
        guest[attribute] = value;
        this.setState({guest: guest});
    }

    handleGroupChange(data) {
        const {value} = data;
        if (value === Const.NEW_GROUP_OPT) {
            /* Summon modal for group creation*/
            this.setState({
                displayGroupCreationModal: true
            });
        } else {
            this.setGroup(parseInt(value));
        }
    }

    onAddGroup(group) {
        this.setGroup(group.id);
        this.props.onAddGroup(group);
        this.removeCreateGroupModal();
    }

    setGroup(groupId) {
        let guest = {...this.state.guest, groupId: groupId};
        this.setState({guest: guest});
    }

    removeCreateGroupModal() {
        this.setState({
            displayGroupCreationModal: false
        })
    }

    save(e) {
        if (e && typeof(e.preventDefault) === "function") {
            e.preventDefault();
        }
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

    getGroupOptions() {
        const groupOptions = this.props.groupsList.map(group => ({key: group.id, value: group.id, text: group.name}));
        return [
            {key:"NONE", value:"", text:"None"},
            ...groupOptions,
            {key: Const.NEW_GROUP_OPT, value: Const.NEW_GROUP_OPT, text: "New Group"}
        ]

    }

    render() {
        return (
            <Table.Row className="guest-line-form">
                <Table.Cell className="guest-line-form__cell">
                    <Input placeholder="First Name"
                           value={this.state.guest.firstName}
                           onChange={(e, data) => this.handleChange('firstName', data)}
                           ref={e => this.toFocus = e}/>
                </Table.Cell>
                <Table.Cell className="guest-line-form__cell">
                    <Input placeholder="Last Name"
                           value={this.state.guest.lastName}
                           onChange={(e, data) => this.handleChange('lastName', data)} />
                </Table.Cell>
                <Table.Cell className="guest-line-form__cell">
                    <Dropdown
                        data-testid="guest-line-form__input--sex"
                        value={this.state.guest.sex}
                        onChange={(e, data) => this.handleChange('sex', data)}
                        options={[
                            {key: Const.GENDER.MALE, value: Const.GENDER.MALE, text: "Male"},
                            {key: Const.GENDER.FEMALE, value: Const.GENDER.FEMALE, text: "Female"}
                        ]}
                    />
                </Table.Cell>
                <Table.Cell className="guest-line-form__cell">
                    <Dropdown
                        data-testid="guest-line-form__input--group"
                        value={this.state.guest.groupId}
                        onChange={(e, data) => this.handleGroupChange(data)}
                        search
                        options={this.getGroupOptions()}
                    />
                    <ModalPortal>
                        {
                            this.state.displayGroupCreationModal ?
                                <CreateGroupModal onSave={this.onAddGroup} onCancel={this.removeCreateGroupModal}/>
                            : null
                        }
                    </ModalPortal>
                </Table.Cell>
                <Table.Cell className="guest-line-form__cell">
                    <button
                        type="submit"
                        onClick={e => this.save(e)}>
                        Ok
                    </button> {/*TODO: add form validation*/}
                    <button
                        id="guest-line-form__input--cancel"
                        type="button"
                        onClick={_ => this.props.onCancel()}>
                        Cancel
                    </button>
                </Table.Cell>
            </Table.Row>
        );
    }

    componentDidMount() {
        if (this.toFocus) this.toFocus.focus();
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GuestLineForm)
