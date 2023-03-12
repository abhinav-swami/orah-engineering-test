import { combineReducers, createStore } from "redux"

import studentAttendence from "./reducers/studentAttendence"

const rootReducer = combineReducers({
  studentAttendence,
})

const store = createStore(rootReducer)

export default store
