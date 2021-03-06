import React from 'react';
import Utils from '../utils/utils.js';

export default class CreateGroupModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
    }

    onChange(e) {
        this.setState({name: e.target.value});
    }

    save() {
        const id = Utils.generateId();
        const group = {
            name: this.state.name,
            id: id
        };
        this.props.onSave(group);
    }

    cancel() {
        this.props.onCancel();
    }

    render () {
        return (
            <dialog open>
                <h2>Create new group</h2>
                <form onSubmit={_ => this.save()}>
                    <input
                        placeholder="Group Name"
                        value={this.state.name}
                        onChange={e => this.onChange(e)}
                        ref={e => this.toFocus = e}
                    />
                    <button id="create-group-modal__input--submit" type="submit">Save</button>
                    <button type="button" onClick={_ => this.cancel()}>Cancel</button>
                </form>
            </dialog>
        )
    }

    componentDidMount() {
        if (this.toFocus) this.toFocus.focus();
    }
}
