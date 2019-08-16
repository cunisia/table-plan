import React from 'react';
import Utils from '../utils/utils.js';
import { connect } from 'react-redux'
import { addTable, editTable } from '../store/actions/tables.js'
import Const from '../utils/const.js'

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, props) => ({
    onSave: (table) => {
        if (table.id === Const.NEW_TABLE_ID) {
            dispatch(addTable(table));
        } else {
            dispatch(editTable(table));
        }
        if (typeof(props.onSave) === "function") {
            props.onSave();
        }
    }
});

class TableLineForm extends React.Component {
    constructor(props) {
        super(props);
        let table = {...this.props.table};
        for (let attr in table) {
            if (table[attr] === null) {
                table[attr] = '';
            }
        }
        this.state = {
            table: table
        }
    }

    onTableAttributeChange(attribute, value) {
        const table = {...this.state.table};
        table[attribute] = value;
        this.setState({table: table});
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
        this.props.onSave(table);
    }

    /*
     --- RENDERING ---
     */

    renderNbSeatsForm() {
        const seatsWidthInput = (
            <input
                data-testid="table-line-form__input--seats-with"
                value={this.state.table.seatsWidth}
                type="number"
                onChange={e => this.onTableAttributeChange('seatsWidth', e.target.value)} />
        )
        if (this.state.table.isCircle) {
            return seatsWidthInput;
        } else {
            return (
                <div>
                    W:{seatsWidthInput}
                    x
                    H:<input
                        data-testid="table-line-form__input--seats-height"
                        value={this.state.table.seatsHeight}
                        type="number"
                        onChange={e => this.onTableAttributeChange('seatsHeight', e.target.value)} />
                </div>
            )
        }
    }

    render() {
        return (
            <tr className="table-line-form">
                <td>
                    <input
                        placeholder="Name"
                        value={this.state.table.name}
                        onChange={e => this.onTableAttributeChange('name', e.target.value)}/>
                </td>
                <td>
                    <select
                        data-testid="table-line-form__select--is-circle"
                        value={this.state.table.isCircle}
                        onChange={e => this.onTableAttributeChange('isCircle', e.target.value === "false" ? false : true)}>
                            <option value="false">Rectangle</option>
                            <option value="true">Circle</option>
                    </select>
                </td>
                <td>
                    {this.renderNbSeatsForm()}
                </td>
                <td>
                    <button type="submit" id="table-line-form__input--submit" onClick={e => this.save(e)}>Ok</button>
                    <button type="button" id="table-line-form__input--cancel" onClick={_ => this.props.onCancel()}>Cancel</button>
                </td>
            </tr>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TableLineForm)