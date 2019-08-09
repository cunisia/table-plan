import {connect} from 'react-redux';
import ConstraintsList from './ConstraintsList';
import {onGenericConstraintChange} from '../store/actions/constraints.js';

const mapStateToProps = state => {
    return {
        constraints: state.constraints
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGenericConstraintChange: (attribute, value) => dispatch(onGenericConstraintChange(attribute, value))
    }
};

const ConstraintsListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConstraintsList)

export default ConstraintsListContainer;