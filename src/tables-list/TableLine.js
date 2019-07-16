import React from 'react';

export default class TableLine extends React.Component {
    getNbSeats() {
        return this.props.table.isCircle ? this.props.table.seatsWidth : 2 * this.props.table.seatsWidth + 2 * this.props.table.seatsHeight;
    }

    getShapeLabel() {
        return this.props.table.isCircle ? "Circle" : "Rectangle (" + this.props.table.seatsWidth + " x " + this.props.table.seatsHeight + ")";
    }

    render() {
        return (
            <tr>
                <td>{this.props.table.name}</td>
                <td>{this.getShapeLabel()}</td>
                <td>{this.getNbSeats()}</td>
                <td>
                    <button type="button" onClick={_ => this.props.onEdit(this.props.table)}>Edit</button>
                    <button type="button" onClick={_ => this.props.onCopy(this.props.table)}>Copy</button>
                    <button type="button" onClick={_ => this.props.onDelete(this.props.table)}>Delete</button>
                </td>
            </tr>
        )
    }
}