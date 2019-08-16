import {connect} from 'react-redux';
import GuestsList from './GuestsList';

const mapStateToProps = state => {
    return {
        guestsList: state.guestsList
    };
};

const GuestsListContainer = connect(
    mapStateToProps
)(GuestsList)

export default GuestsListContainer;