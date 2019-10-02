import {connect} from 'react-redux';
import Plan from './Plan';
import {generatePlan} from '../store/actions/plan.js';

const mapStateToProps = state => {
    return {
        ...state.planWrapper
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