import { applyMiddleware, compose } from "redux"
import {
  configureStore,
  createSlice,
  getDefaultMiddleware,
} from "@reduxjs/toolkit"

import createSagaMiddleware from "redux-saga"

import rootReducer from "./reducers"
import rootSaga from "./sagas"

// const sagaMiddleware = createSagaMiddleware()
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// const store = configureStore({
//   reducer: (
//     rootReducer,
//     composeEnhancers(applyMiddleware(sagaMiddleware))
//   )
// })

// const sparklaunchSlice = createSlice({
//   name: "sparklaunch",
//   initialState: {
//     todos: [],
//   },
//   reducers: {
//     fetchData: (state, action) => {
//       return {
//         todos: action.payload,
//       }
//     },
//   },
// })

// export const { fetchData } = sparklaunchSlice.actions

const sagaMiddleware = createSagaMiddleware()
const middleware = [
  ...getDefaultMiddleware({
    thunk: true,
    // immutableCheck: false,
    // serializableCheck: false,
  }),
  sagaMiddleware,
]

const store = configureStore({
  reducer: rootReducer,
  middleware,
})

sagaMiddleware.run(rootSaga)

export default store
