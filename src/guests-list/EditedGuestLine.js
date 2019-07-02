import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import CreateGroupModal from './CreateGroupModal.js';
import Utils from '../utils/utils.js';
import Const from '../utils/const.js'

export default class EditedGuestLine extends React.Component {
    constructor(props) {
        super(props);
        let guest = _.clone(this.props.guest);
        for (const attr in guest) {
            if (guest[attr] === null) {
                if (attr === 'sexe') {
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
            <tr>
                <td><input value={this.state.guest.firstName} onChange={e => this.handleChange('firstName', e)} ref={e => this.toFocus = e}/></td>
                <td><input value={this.state.guest.lastName} onChange={e => this.handleChange('lastName', e)} /></td>
                <td>
                    <select value={this.state.guest.sexe} onChange={e => this.handleChange('sexe', e)}>
                        <option value={Const.GENDER.MALE}>Male</option>
                        <option value={Const.GENDER.FEMALE}>Female</option>
                    </select>
                </td>
                <td>
                    <select value={this.state.guest.group.id} onChange={e => this.handleGroupChange(e)}>
                        <option value="">None</option>
                        {this.renderGroupOptions()}
                        <option value={Const.NEW_GROUP_OPT}>New Group</option>
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
