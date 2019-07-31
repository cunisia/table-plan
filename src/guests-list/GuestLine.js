import React from 'react';

export default class GuestLine extends React.Component {

    getGroupName(groupId) {
        for (let i in this.props.groupsList) {
            const group = this.props.groupsList[i];
            if (groupId === group.id) {
                return group.name;
            }
        }
    }

    render() {
        return (
            <tr className="guest-line">
                <td className="guest-line__cell guest-line__cell--first-name">{this.props.guest.firstName}</td>
                <td className="guest-line__cell guest-line__cell--last-name">{this.props.guest.lastName}</td>
                <td className="guest-line__cell guest-line__cell--sex">{this.props.guest.sex}</td>
                <td className="guest-line__cell guest-line__cell--group">{this.props.guest.groupId ? this.getGroupName(this.props.guest.groupId) : ''}</td>
                <td className="guest-line__cell guest-line__cell--actions">
                    <button className="guest-line__btn guest-line__btn--edit" type="button" onClick={_ => this.props.onEdit(this.props.guest.id)}>Edit</button>
                    <button className="guest-line__btn guest-line__btn--delete" type="button" onClick={_ => this.props.onDelete(this.props.guest.id)}>Delete</button>
                </td>
            </tr>
        );
    }
}
