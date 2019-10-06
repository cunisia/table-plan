import {connect} from 'react-redux';
import Plan from './Plan';
import {generatePlan} from '../store/actions/plan.js';

const mapStateToProps = state => {
    const {planWrapper, tablesList, guestsList} = state;
    return {
        planWrapper,
        tablesList,
        guestsList
    };
};

const mapDispatchToProps = dispatch => {
    return {
        generatePlan: table => dispatch(generatePlan()),
    }
};

const PlanContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Plan)

export default PlanContainer;