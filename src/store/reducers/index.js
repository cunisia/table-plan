import { combineReducers } from 'redux'
import guestsReducer from './guests.js'
import groupsReducer from './groups.js'
import tablesReducer from './tables.js'
import constraintsReducer from './constraints'

const tablePlanReducer = combineReducers({
    guestsList: guestsReducer,
    groupsList: groupsReducer,
    tablesList: tablesReducer,
    constraints: constraintsReducer
});

export default tablePlanReducer;