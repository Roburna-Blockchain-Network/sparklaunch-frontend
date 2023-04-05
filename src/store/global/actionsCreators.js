import * as ActionTypes from "./ActionTypes"

export const setInitialSales = p => ({
  type: ActionTypes.ADD_SALES,
  payload: p,
})
export const setUpdateSale = p => ({
  type: ActionTypes.UPDATE_SALE,
  payload: p,
})
export const updateSaleTime = (address, start, end) => ({
  //  // console.log(address)
  type: ActionTypes.UPDATE_SALE_TIME,
  payload: { address, start, end },
})

export const addNewSale = (id, status) => ({
  type: ActionTypes.ADD_SALE,
  payload: { id, status },
})

export const setSaleDeployed = p => ({
  type: ActionTypes.SET_NUMBER_DEPLOYED,
  payload: p,
})

export const clearAllSales = p => ({
  type: ActionTypes.CLEAR_SALE,
  payload: p,
})

export const setLoginStatus = p => ({
  type: ActionTypes.SET_LOGIN_STATUS,
  payload: p,
})
export const setAdminStatus = p => ({
  type: ActionTypes.SET_ADMIN_STATUS,
  payload: p,
})
