import { combineReducers } from 'redux'
import guestsReducer from './guests.js'
import groupsReducer from './groups.js'
import tablesReducer from './tables.js'

const tablePlanReducer = combineReducers({
    guestsList: guestsReducer,
    groupsList: groupsReducer,
    tablesList: tablesReducer
});

export default tablePlanReducer;