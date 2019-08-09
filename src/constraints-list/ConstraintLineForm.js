import React from 'react';
import { connect } from 'react-redux'
import { addConstraint, editConstraint } from '../store/actions/constraints.js'
import Utils from '../utils/utils.js';
import Const from '../utils/const.js';
import GuestUtils from '../guests-list/GuestUtils';

const mapStateToProps = (state) => ({
    guestsList: state.guestsList,
    groupsList: state.groupsList,
    tablesList: state.tablesList
});

const mapDispatchToProps = (dispatch, props) => ({
    onSave: (constraint) => {
        if (constraint.id === Const.NEW_CONSTRAINT_ID) {
            dispatch(addConstraint(constraint));
        } else {
            dispatch(editConstraint(constraint));
        }
        props.onSave();
    }
});

class ConstraintLineForm extends React.Component {

    constructor(props) {
        super(props);
        let constraint = {...this.props.constraint};
        for (let attr in constraint) {
            if (constraint[attr] === null) {
                constraint[attr] = '';
            }
        }
        this.state = {
            constraint: constraint
        }
    }

    save(e) {
        if (e && typeof(e.preventDefault) === 'function') {
            e.preventDefault();
        }
        let table = {...this.state.table};
        for (let attr in table) {
            if (Utils.isEmptyString(table[attr])) {
                table[attr] = null;
            }
        }
        this.props.onSave(this.state.constraint);
    }

    /*
        --- LISTENERS ---
     */

    onConstraintAttributeChange(attribute, value) {
        let constraint = {...this.state.constraint};
        constraint[attribute] = value
        this.setState({
            constraint: constraint
        });
    }

    onConstraintSubjectChange(e) {
        const newGroupsIdList = [...e.target.options].filter(o => o.selected && o.dataset.type==="group").map(o => o.value);
        const newGuestsIdList = [...e.target.options].filter(o => o.selected && o.dataset.type==="guest").map(o => o.value);
        const newConstraint = {
            ...this.state.constraint,
            groupsIdList: newGroupsIdList,
            guestsIdList: newGuestsIdList
        }
        this.setState({
            constraint: newConstraint
        });
    }

    onConstraintTableChange(value) {
        this.setState({
            constraint: {...this.state.constraint, tablesIdList: [value]}
        });
    }

    /*
        --- RENDERING ---
     */

    getMergedConstraintSubjects() {
        return this.state.constraint.groupsIdList.concat(this.state.constraint.guestsIdList);
    }

    renderSubjectOptions() {
        return (
            <React.Fragment>
                <optgroup label="Guests">
                    {this.props.guestsList.map(guest => (<option key={guest.id} data-type="guest" value={guest.id} >{GuestUtils.getGuestFullName(guest)}</option>))}
                </optgroup>
                <optgroup label="Groups">
                    {this.props.groupsList.map(group => (<option key={group.id} data-type="group" value={group.id} >{group.name}</option>))}
                </optgroup>
            </React.Fragment>
        )
    }

    renderTypeOptions() {
        return Object.keys(Const.CONSTRAINTS_LABEL).map(key => (<option key={key} value={key}>{Const.CONSTRAINTS_LABEL[key]}</option>));
    }

    isTablesFormDisplayed() {
        return this.state.constraint.type === Const.CONSTRAINTS.SEAT_AT_SPECIFIC_TABLE;
    }

    renderTableForm() {
        if (this.isTablesFormDisplayed()) {
            return (
                <td>
                    <select
                        value={this.state.constraint.tablesIdList[0] ? this.state.constraint.tablesIdList[0] : ''}
                        onChange={e => this.onConstraintTableChange(e.target.value)}>
                        <option key="SELECT_TABLE" value="">Select a table</option>
                        {this.props.tablesList.map(table => (<option key={table.id} value={table.id}>{table.name}</option>))}
                    </select>
                </td>
            )
        }
    }

    render() {
        return (
            <tr className="constraint-line-form'">
                <td>
                    <select multiple
                            value={this.getMergedConstraintSubjects()}
                            onChange={e => this.onConstraintSubjectChange(e)}
                    >
                        {this.renderSubjectOptions()}
                    </select>
                </td>
                <td>
                    <select
                        value={this.state.constraint.affirmative}
                        onChange={e => this.onConstraintAttributeChange("affirmative", e.target.value === "false" ? false : true)}
                    >
                        <option value={true} >must</option>
                        <option value={false} >must not</option>
                    </select>
                </td>
                <td colSpan={this.isTablesFormDisplayed() ? 1 :2}>
                    <select
                        value={this.state.constraint.type}
                        onChange={e => this.onConstraintAttributeChange("type", e.target.value)}
                    >
                        {this.renderTypeOptions()}
                    </select>
                </td>
                { this.renderTableForm() }
                <td>
                    <button type="submit" id="constraint-line-form__input--submit" onClick={e => this.save(e)}>Ok</button>
                    <button type="button" id="constraint-line-form__input--cancel" onClick={_ => this.props.onCancel()}>Cancel</button>
                </td>
            </tr>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConstraintLineForm)