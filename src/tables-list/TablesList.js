import React from 'react';
import Const from '../utils/const.js';

import TableLine from './TableLine.js';
import TableLineForm from './TableLineForm.js';

export default class TablesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newTable: null,
            editedTableId: null
        };
        this.editTable = this.editTable.bind(this);
        this.removeTableForm = this.removeTableForm.bind(this);
    }

    /*
        --- CRUD ---
     */

    async addTable() {
        await this.removeTableForm();
        const table = {
            id: Const.NEW_TABLE_ID,
            name: "Table " + (this.props.tablesList.length + 1),
            isCircle: false,
            seatsWidth: 4,
            seatsHeight: 2,
        };
        this.setState({
            newTable: table
        });
    }

    async editTable(table) {
        await this.removeTableForm();
        this.setState({editedTableId: table.id});
    }

    removeTableForm() {
        if (this.state.editedTableId !== null || this.state.newTable !== null) {
            this.setState({
                newTable: null,
                editedTableId: null
            });
        }
    }

    /*
        --- RENDERING ---
     */

    renderTableList() {
        return this.props.tablesList.map(table => {
            if (table.id === this.state.editedTableId) {
                return (<TableLineForm table={table} key={table.id} onSave={this.removeTableForm} onCancel={this.removeTableForm} />);
            } else {
                return (<TableLine table={table} key={table.id} onEdit={this.editTable} onCopy={this.removeTableForm} onDelete={this.removeTableForm}/>)
            }
        });
    }

    renderNewTableForm() {
        if (this.state.newTable !== null) {
            return (<TableLineForm key={this.state.newTable.id} table={this.state.newTable} onSave={this.removeTableForm} onCancel={this.removeTableForm}/>)
        }
    }

    render() {
        return (
            <section>
                <h1>Tables List</h1>
                <form>
                    <table>
                        <thead>
                        <tr>
                            <td>Name</td>
                            <td>Shape</td>
                            <td>Nb Seats</td>
                            <td>Action</td>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderTableList()}
                        {this.renderNewTableForm()}
                        </tbody>
                    </table>
                    <button
                        id="tables-list__add-table"
                        type="button"
                        onClick={_ => this.addTable()}
                        ref={e => this.addTableBtn = e}>
                        Add Table
                    </button>
                </form>
            </section>
        );
    }
}