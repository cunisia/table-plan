import React from 'react';
import { connect } from 'react-redux'
import { copyConstraint, deleteConstraint } from '../store/actions/constraints.js'
import ConstraintUtils from './ConstraintUtils.js';

const mapStateToProps = (state) => ({
    guestsList: state.guestsList,
    groupsList: state.groupsList,
    tablesList: state.tablesList
});

const mapDispatchToProps = (dispatch, props) => ({
    onCopy: (constraint) => {
        dispatch(copyConstraint(constraint.id));
        if (typeof(props.onCopy(constraint)) === "function") {
            props.onCopy(constraint)
        }
    },
    onDelete: (constraint) => {
        dispatch(deleteConstraint(constraint.id));
        if (typeof(props.onDelete(constraint)) === "function") {
            props.onDelete(constraint)
        }
    }
});

function ConstraintLine(props) {
    return (
        <tr className="constraint-line">
            <td colSpan="4">
                {ConstraintUtils.getLabel(props.constraint, props.guestsList, props.groupsList, props.tablesList)}
            </td>
            <td>
                <button type="button" className="constraint-line__btn--edit" onClick={_ => props.onEdit(props.constraint)}>Edit</button>
                <button type="button" className="constraint-line__btn--copy" onClick={_ => props.onCopy(props.constraint)}>Copy</button>
                <button type="button" className="constraint-line__btn--delete" onClick={_ => props.onDelete(props.constraint)}>Delete</button>
            </td>
        </tr>
    )
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConstraintLine)