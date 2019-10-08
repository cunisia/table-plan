import React from 'react';
import {Table, Button, Popup} from 'semantic-ui-react';
import { connect } from 'react-redux'
import { copyGuest, deleteGuest } from '../store/actions/guests.js'

const mapStateToProps = (state) => ({
    groupsList: state.groupsList
});

const mapDispatchToProps = (dispatch, props) => ({
    onCopy: (guest) => {
        dispatch(copyGuest(guest.id));
        if (typeof(props.onCopy(guest)) === "function") {
            props.onCopy(guest)
        }
    },
    onDelete: (guest) => {
        dispatch(deleteGuest(guest.id));
        if (typeof(props.onDelete(guest)) === "function") {
            props.onDelete(guest)
        }
    }
});

class GuestLine extends React.Component {

    getGroupName(groupId) {
        for (let i in this.props.groupsList) {
            const group = this.props.groupsList[i];
            if (groupId === group.id) {
                return group.name;
            }
        }
    }

    render() {
        const editButton = (
            <Button
                icon="edit outline"
                className="guest-line__btn guest-line__btn--edit"
                type="Button"
                onClick={_ => this.props.onEdit(this.props.guest.id)}>
            </Button>
        );
        const copyButton = (
            <Button
                icon="copy outline"
                className="guest-line__btn guest-line__btn--copy"
                type="Button"
                onClick={_ => this.props.onCopy(this.props.guest)}>
            </Button>
        );
        const deleteButton = (
            <Button
                icon="trash alternate outline"
                className="guest-line__btn guest-line__btn--delete"
                type="Button"
                onClick={_ => this.props.onDelete(this.props.guest)}>
            </Button>
        );
        return (
            <Table.Row className="guest-line">
                <Table.Cell className="guest-line__cell guest-line__cell--first-name">{this.props.guest.firstName}</Table.Cell>
                <Table.Cell className="guest-line__cell guest-line__cell--last-name">{this.props.guest.lastName}</Table.Cell>
                <Table.Cell className="guest-line__cell guest-line__cell--sex">{this.props.guest.sex}</Table.Cell>
                <Table.Cell className="guest-line__cell guest-line__cell--group">{this.props.guest.groupId ? this.getGroupName(this.props.guest.groupId) : ''}</Table.Cell>
                <Table.Cell className="guest-line__cell guest-line__cell--actions">
                    <Popup content="Edit" inverted size="mini" position="bottom center" trigger={editButton}/>
                    <Popup content="Copy" inverted size="mini" position="bottom center" trigger={copyButton}/>
                    <Popup content="Delete" inverted size="mini" position="bottom center" trigger={deleteButton}/>
                </Table.Cell>
            </Table.Row>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GuestLine)
