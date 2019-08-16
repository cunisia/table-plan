import React from 'react';
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

    handleChange(attribute, event) {
        let guest = {...this.state.guest};
        guest[attribute] = event.target.value;
        this.setState({guest: guest});
    }

    handleGroupChange(event) {
        if (event.target.value === Const.NEW_GROUP_OPT) {
            /* Summon modal for group creation*/
            this.setState({
                displayGroupCreationModal: true
            });
        } else {
            this.setGroup(parseInt(event.target.value));
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

    renderGroupOptions() {
        return this.props.groupsList.map(group => {
            return (
                <option key={group.id} value={group.id}>{group.name}</option>
            )
        })
    }

    render() {
        return (
            <tr className="guest-line-form">
                <td className="guest-line-form__cell">
                    <input placeholder="First Name"
                           value={this.state.guest.firstName}
                           onChange={e => this.handleChange('firstName', e)}
                           ref={e => this.toFocus = e}/>
                </td>
                <td className="guest-line-form__cell">
                    <input placeholder="Last Name"
                           value={this.state.guest.lastName}
                           onChange={e => this.handleChange('lastName', e)} />
                </td>
                <td className="guest-line-form__cell">
                    <select
                        data-testid="guest-line-form__input--sex"
                        value={this.state.guest.sex}
                        onChange={e => this.handleChange('sex', e)}>
                        <option value={Const.GENDER.MALE}>Male</option>
                        <option value={Const.GENDER.FEMALE}>Female</option>
                    </select>
                </td>
                <td className="guest-line-form__cell">
                    <select
                        data-testid="guest-line-form__input--group"
                        value={this.state.guest.groupId}
                        onChange={e => this.handleGroupChange(e)}>
                            <option key={"NONE"} value="">None</option>
                            {this.renderGroupOptions()}
                            <option key={Const.NEW_GROUP_OPT} value={Const.NEW_GROUP_OPT}>New Group</option>
                    </select>
                    <ModalPortal>
                        {
                            this.state.displayGroupCreationModal ?
                                <CreateGroupModal onSave={this.onAddGroup} onCancel={this.removeCreateGroupModal}/>
                            : null
                        }
                    </ModalPortal>
                </td>
                <td className="guest-line-form__cell">
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
                </td>
            </tr>
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
