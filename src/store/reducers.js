import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"
import { Sales, User } from "./global/reducer"

const rootReducer = combineReducers({
  Layout,
  Sales,
  User,
})

export default rootReducer
