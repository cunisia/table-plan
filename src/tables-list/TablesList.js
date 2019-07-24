import React from 'react';
import Const from '../utils/const.js';
import Utils from '../utils/utils.js';
import _ from 'lodash';

import TableLine from './TableLine.js';
import TableLineForm from './TableLineForm.js';

export default class TablesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tablesList: this.props.tablesList || [],
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
            name: "Table " + (this.state.tablesList.length + 1),
            isCircle: false,
            seatsWidth: 4,
            seatsHeight: 2,
        };
        this.setState({
            tablesList: [...this.state.tablesList, table],
            editedTableId: table.id
        });
    }

    saveTable(table) {
        const index = this.state.tablesList.findIndex(t => table.id === t.id);
        if (index >  -1) {
            if (table.id === Const.NEW_TABLE_ID) {
                table = {...table, id: Utils.generateId()};
            }
            this.setState({
                tablesList: Utils.setAtIndex(this.state.tablesList, index, table),
                editedTableId: null
            });
        }
    }

    async editTable(table) {
        await this.cancelEditTable();
        this.setState({editedTableId: table.id});
    }

    cancelEditTable() {
        if (this.state.editedTableId !== null) {
            let state = {
                editedTableId: null
            };
            if (this.state.editedTableId === Const.NEW_TABLE_ID) {
                const index = this.state.tablesList.findIndex(t => this.state.editedTableId === t.id);
                if (index >  -1) {
                    state.tablesList = Utils.deleteAtIndex(this.state.tablesList, index);
                }
            }
            this.setState(state);
        }
    }

    async copyTable(table) {
        await this.cancelEditTable();
        let newTable = _.cloneDeep(table);
        newTable.id = Utils.generateId();
        const index = this.state.tablesList.findIndex(t => t.id === table.id);
        if (index > -1) {
            let tableList = Utils.insertAtIndex(this.state.tablesList, index+1, newTable);
            this.setState({tablesList: tableList});
        } else {
            console.warn("Cannot find table to copy, ignoring: " + JSON.stringify(table));
        }
    }

    async deleteTable(table) {
        await this.cancelEditTable();
        const index = this.state.tablesList.findIndex(t => t.id === table.id);
        if (index > -1) {
            let tableList = Utils.deleteAtIndex(this.state.tablesList, index);
            this.setState({tablesList: tableList});
        } else {
            console.warn("Cannot find table to delete, ignoring: " + JSON.stringify(table));
        }
    }

    /*
        --- RENDERING ---
     */

    renderTableList() {
        return this.state.tablesList.map(table => {
            if (table.id === this.state.editedTableId) {
                return (<TableLineForm table={table} key={table.id} onSave={this.saveTable} onCancel={this.cancelEditTable} />);
            } else {
                return (<TableLine table={table} key={table.id} onEdit={this.editTable} onCopy={this.copyTable} onDelete={this.deleteTable}/>)
            }
        })
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