import {connect} from 'react-redux';
import GuestsList from './GuestsList';
import {addGuest, editGuest, deleteGuest} from '../store/actions/guests.js';
import {addGroup} from '../store/actions/groups.js';

const mapStateToProps = state => {
    return {
        guestsList: state.guestsList,
        groupsList: state.groupsList
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addGuest: guest => dispatch(addGuest(guest)),
        editGuest: guest => dispatch(editGuest(guest)),
        deleteGuest: guestId => dispatch(deleteGuest(guestId)),
        addGroup: groupName => dispatch(addGroup(groupName))
    }
};

const GuestsListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(GuestsList)

export default GuestsListContainer;