import React from 'react';
import TableUtils from './TableUtils'
import { connect } from 'react-redux'
import { copyTable, deleteTable } from '../store/actions/tables.js'

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, props) => ({
    onCopy: (table) => {
        dispatch(copyTable(table.id));
        if (typeof(props.onCopy(table)) === "function") {
            props.onCopy(table)
        }
    },
    onDelete: (table) => {
        dispatch(deleteTable(table.id));
        if (typeof(props.onDelete(table)) === "function") {
            props.onDelete(table)
        }
    }
});

class TableLine extends React.Component {
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TableLine)