import React from 'react';
import TableUtils from './TableUtils'

export default class TableLine extends React.Component {
    getNbSeats() {
        return TableUtils.getNbSeats(this.props.table.isCircle, this.props.table.seatsWidth, this.props.table.seatsHeight);
    }

    getShapeLabel() {
        return TableUtils.getShapeLabel(this.props.table.isCircle, this.props.table.seatsWidth, this.props.table.seatsHeight);
    }

    render() {
        return (
            <tr className="table-line">
                <td className="table-line__cell--name">{this.props.table.name}</td>
                <td className="table-line__cell--shape">{this.getShapeLabel()}</td>
                <td className="table-line__cell--nb-seats">{this.getNbSeats()}</td>
                <td>
                    <button type="button" className="table-line__btn--edit" onClick={_ => this.props.onEdit(this.props.table)}>Edit</button>
                    <button type="button" className="table-line__btn--copy" onClick={_ => this.props.onCopy(this.props.table)}>Copy</button>
                    <button type="button" className="table-line__btn--delete" onClick={_ => this.props.onDelete(this.props.table)}>Delete</button>
                </td>
            </tr>
        )
    }
}