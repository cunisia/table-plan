import { PlanActionTypes } from '../actions/plan.js';

const initialState = {
    pending: false,
    plan: {},
    error: null
}

const planReducer = (state = initialState, action) => {
    switch (action.type) {
        case (PlanActionTypes.GENERATE_PLAN_PENDING):
            return {
                ...state,
                pending: true
            };
        case (PlanActionTypes.GENERATE_PLAN_SUCCESS):
            return {
                ...state,
                pending: false,
                plan: action.payload
            };
        case (PlanActionTypes.GENERATE_PLAN_ERROR):
            return {
                ...state,
                pending: false,
                plan: action.error
            };
        default:
            return state;
    }
};

export default planReducer;
