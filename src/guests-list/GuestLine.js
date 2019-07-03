import React from 'react';

export default function GuestLine(props) {
    return (
        <tr className="guest-line">
            <td className="guest-line__cell guest-line__cell--first-name">{props.guest.firstName}</td>
            <td className="guest-line__cell guest-line__cell--last-name">{props.guest.lastName}</td>
            <td className="guest-line__cell guest-line__cell--sex">{props.guest.sex}</td>
            <td className="guest-line__cell guest-line__cell--group">{props.guest.group ? props.guest.group.name : ''}</td>
            <td className="guest-line__cell guest-line__cell--actions">
                <button className="guest-line__btn" id="guest-line__btn--edit" type="button" onClick={_ => props.onEdit(props.guest.id)}>Edit</button>
                <button className="guest-line__btn" id="guest-line__btn--delete" type="button" onClick={_ => props.onDelete(props.guest.id)}>Delete</button>
            </td>
        </tr>
    );
}
