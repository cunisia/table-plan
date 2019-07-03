import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import CreateGroupModal from './CreateGroupModal.js';
import Utils from '../utils/utils.js';
import Const from '../utils/const.js'

export default class GuestLineForm extends React.Component {
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
        if (event.target.value === Const.NEW_GROUP_OPT) {
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
            <tr className="guest-line-form">
                <td className="guest-line-form__cell">
                    <input id="guest-line-form__input--first-name" value={this.state.guest.firstName} onChange={e => this.handleChange('firstName', e)} ref={e => this.toFocus = e}/>
                </td>
                <td className="guest-line-form__cell">
                    <input id="guest-line-form__input--last-name" value={this.state.guest.lastName} onChange={e => this.handleChange('lastName', e)} />
                </td>
                <td className="guest-line-form__cell">
                    <select
                        id="guest-line-form__input--sex"
                        value={this.state.guest.sex}
                        onChange={e => this.handleChange('sex', e)}>
                        <option value={Const.GENDER.MALE}>Male</option>
                        <option value={Const.GENDER.FEMALE}>Female</option>
                    </select>
                </td>
                <td className="guest-line-form__cell">
                    <select
                        id="guest-line-form__input--group"
                        value={this.state.guest.group.id}
                        onChange={e => this.handleGroupChange(e)}>
                        <option value="">None</option>
                        {this.renderGroupOptions()}
                        <option value={Const.NEW_GROUP_OPT}>New Group</option>
                    </select>
                </td>
                <td className="guest-line-form__cell">
                    <button
                        id="guest-line-form__input--submit"
                        type="submit"
                        onClick={_ => this.save()}>
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
