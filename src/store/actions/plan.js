export const PlanActionTypes = {
    GENERATE_PLAN_PENDING: 'GENERATE_PLAN_PENDING',
    GENERATE_PLAN_SUCCESS: 'GENERATE_PLAN_SUCCESS',
    GENERATE_PLAN_ERROR: 'GENERATE_PLAN_ERROR',
};

export const generatePlanPending = () => ({
    type: PlanActionTypes.GENERATE_PLAN_PENDING,
});

export const generatePlanSuccess = (plan) => ({
    type: PlanActionTypes.GENERATE_PLAN_SUCCESS,
    plan
});

export const generatePlanError = (error) => ({
    type: PlanActionTypes.GENERATE_PLAN_ERROR,
    error
});

export const generatePlan = () => {
    return (dispatch, getState) => {
        dispatch(generatePlanPending());

        return fetch(`http://localhost:8080/generate-plan`,{
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getState())
        })
        .then(
            response => response.json(),
            error => generatePlanError(error)
        )
        .then(json =>
            dispatch(generatePlanSuccess(json)),
            error => generatePlanError(error)
        )
    }
}