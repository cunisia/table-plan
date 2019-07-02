import React from 'react';

export default function GuestLine(props) {
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
