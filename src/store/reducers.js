import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"
import { Sales } from "./global/reducer"

const rootReducer = combineReducers({
  Layout,
  Sales,
})

export default rootReducer
