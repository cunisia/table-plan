import React from 'react'
import Const from '../utils/const.js'
import ConstraintLineForm from './ConstraintLineForm.js'
import ConstraintLine from './ConstraintLine.js'

export default class ContraintsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editedConstraintId: null,
            newConstraint: null
        }
        this.editConstraint = this.editConstraint.bind(this);
        this.removeConstraintForm = this.removeConstraintForm.bind(this);
    }

    /*
        --- CRUD ---
     */

    async editConstraint(constraint) {
        await this.removeConstraintForm();
        this.setState({
            editedConstraintId: constraint.id
        });
    }

    async addConstraint() {
        await this.removeConstraintForm();
        const newConstraint = {
            id: Const.NEW_CONSTRAINT_ID,
            type: Const.CONSTRAINTS.BE_NEXT_TO,
            affirmative: true,
            guestsIdList: [],
            groupsIdList: [],
            tablesIdList: []
        };
        this.setState({
           newConstraint: newConstraint
        });
    }


    removeConstraintForm() {
        if (this.state.editedConstraintId !== null || this.state.newConstraint !== null) {
            this.setState({
                editedConstraintId: null,
                newConstraint: null
            })
        }
    }

    /*
        --- RENDERING ---
     */

    renderConstraintsList() {
        return this.props.constraints.list.map(constraint => {
            if (constraint.id === this.state.editedConstraintId) {
                return (
                    <ConstraintLineForm
                        key={constraint.id}
                        constraint={constraint}
                        onSave={this.removeConstraintForm}
                        onCancel={this.removeConstraintForm}>
                    </ConstraintLineForm>
                );
            } else {
                return (
                    <ConstraintLine
                        key={constraint.id}
                        constraint={constraint}
                        onEdit={this.editConstraint}
                        onDelete={this.removeConstraintForm}
                        onCopy={this.removeConstraintForm}>
                    </ConstraintLine>
                );
            }
        });
    }

    renderNewConstraintForm() {
        if (this.state.newConstraint !== null) {
            return (
                <ConstraintLineForm
                    key={this.state.newConstraint.id}
                    constraint={this.state.newConstraint}
                    onSave={this.removeConstraintForm}
                    onCancel={this.removeConstraintForm}>
                </ConstraintLineForm>
            );
        }
    }

    render() {
        return (
            <section>
                <h1>Constraints List</h1>
                <form>
                    <div>
                        <div>
                            <input
                                name="Seat groups together"
                                id="seat-groups-together"
                                type="checkbox"
                                defaultChecked={this.props.constraints.generic.seatGroupsTogether}
                                onChange={e => this.props.onGenericConstraintChange("seatGroupsTogether", e.target.value === "false" ? false : true)}
                            />
                            <label htmlFor="seat-groups-together">Groups must seat at the same table</label>
                        </div>
                        <div>
                            <input
                                name="Exclusive groups"
                                id="exclusive-groups"
                                type="checkbox"
                                defaultChecked={this.props.constraints.generic.exclusiveGroups}
                                onChange={e => this.props.onGenericConstraintChange("exclusiveGroups", e.target.value === "false" ? false : true)}
                            />
                            <label htmlFor="exclusive-groups">Group's table is exclusive</label>
                        </div>
                        <div>
                            <input
                                name="Exclusive groups"
                                id="exclusive-groups"
                                type="checkbox"
                                defaultChecked={this.props.constraints.generic.exclusiveGroupsToGroups}
                                onChange={e => this.props.onGenericConstraintChange("exclusiveGroupsToGroups", e.target.value === "false" ? false : true)}
                            />
                            <label htmlFor="exclusive-groups">Group's table is exclusive to other groups only</label>
                        </div>
                        <div>
                            <input
                                name="Alternate sex"
                                id="alternate-sex"
                                type="checkbox"
                                defaultChecked={this.props.constraints.generic.alternateSex}
                                onChange={e => this.props.onGenericConstraintChange("alternateSex", e.target.value === "false" ? false : true)}
                            />
                            <label htmlFor="exclusive-groups">Alternate sex</label>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <td colSpan="4">
                                    Constraint
                                </td>
                                <td>
                                    Actions
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderConstraintsList()}
                            {this.renderNewConstraintForm()}
                        </tbody>
                    </table>
                    <button
                        type="button"
                        onClick={_ => this.addConstraint()}
                        ref={e => this.addTableBtn = e}>
                        Add Constraint
                    </button>
                </form>
            </section>
        )
    }
}

/*

BE_NEXT_TO
SEAT_AT_SAME_TABLE
SEAT_AT_SPECIFIC_TABLE
HAVE_EXCLUSIVE_TABLE
HAVE_GROUP_EXCLUSIVE_TABLE

G1 must be next to G2
G1 must not be next to G2
G1 must seat at the same table as G2
G1 must not seat at the same table as G2
G1 must seat at table T1

Gr must seat at the same table
Gr must be alone at its table
Gr must seat at table T1

Checkbox:
- Groups must seat at the same table
- Groups must be alone at their table
- Alternate girls and boys
// - Couples must be next to each other

//G1 must be as far as possible from G2
//G1 must
 */