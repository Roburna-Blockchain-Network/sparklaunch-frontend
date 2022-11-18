import * as ActionTypes from "./ActionTypes"

export const setInitialSales = p => ({
  type: ActionTypes.ADD_SALES,
  payload: p,
})

export const addNewSale = p => ({
  type: ActionTypes.ADD_SALE,
  payload: p,
})

export const setSaleDeployed = p => ({
  type: ActionTypes.SET_NUMBER_DEPLOYED,
  payload: p,
})

export const setLoginStatus = p => ({
  type: ActionTypes.SET_LOGIN_STATUS,
  payload: p,
})
export const setSelectedChain = p => ({
  type: ActionTypes.SET_CHAIN,
  payload: p,
})
