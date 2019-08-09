export const ConstraintActionTypes = {
    ADD_CONSTRAINT: 'ADD_CONSTRAINT',
    DELETE_CONSTRAINT: 'DELETE_CONSTRAINT',
    COPY_CONSTRAINT: 'COPY_CONSTRAINT',
    EDIT_CONSTRAINT: 'EDIT_CONSTRAINT',
    EDIT_GENERIC_CONSTRAINT: 'EDIT_GENERIC_CONSTRAINT'
};

export const addConstraint = (constraint) => ({
    type: ConstraintActionTypes.ADD_CONSTRAINT,
    constraint
});

export const deleteConstraint = (constraintId) => ({
    type: ConstraintActionTypes.DELETE_CONSTRAINT,
    constraintId
});

export const copyConstraint = (constraintId) => ({
    type: ConstraintActionTypes.COPY_CONSTRAINT,
    constraintId
});

export const editConstraint = (constraint) => ({
    type: ConstraintActionTypes.EDIT_CONSTRAINT,
    constraint
});

export const onGenericConstraintChange = (attribute, value) => ({
    type: ConstraintActionTypes.EDIT_GENERIC_CONSTRAINT,
    attribute, value
})