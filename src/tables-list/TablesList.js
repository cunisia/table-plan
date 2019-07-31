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
        this.copyTable = this.copyTable.bind(this);
        this.deleteTable = this.deleteTable.bind(this);
        this.saveTable = this.saveTable.bind(this);
        this.cancelEditTable = this.cancelEditTable.bind(this);
    }

    /*
        --- CRUD ---
     */

    async addTable() {
        await this.cancelEditTable();
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

    saveTable(table) {
        if (table.id === Const.NEW_TABLE_ID) {
            this.props.addTable(table)
        } else {
            this.props.editTable(table)
        }
        this.setState({
            newTable: null,
            editedTableId: null
        });
    }

    async editTable(table) {
        await this.cancelEditTable();
        this.setState({editedTableId: table.id});
    }

    async copyTable(table) {
        await this.cancelEditTable();
        this.props.copyTable(table.id);
    }

    async deleteTable(table) {
        await this.cancelEditTable();
        this.props.deleteTable(table.id);
    }

    cancelEditTable() {
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
                return (<TableLineForm table={table} key={table.id} onSave={this.saveTable} onCancel={this.cancelEditTable} />);
            } else {
                return (<TableLine table={table} key={table.id} onEdit={this.editTable} onCopy={this.copyTable} onDelete={this.deleteTable}/>)
            }
        });
    }

    renderNewTableForm() {
        if (this.state.newTable !== null) {
            return (<TableLineForm key={this.state.newTable.id} table={this.state.newTable} onSave={this.saveTable} onCancel={this.cancelEditTable}/>)
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