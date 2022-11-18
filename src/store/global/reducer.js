import * as ActionTypes from "./ActionTypes"

export const Sales = (
  state = {
    isLoading: false,
    errMess: null,
    deployedSales: 0,
    sales: [],
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.ADD_SALES:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        deployedSales: state.deployedSales,
        sales: action.payload,
      }
    case ActionTypes.ADD_SALE:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        deployedSales: state.deployedSales + 1,
        sales: state.sales.concat([action.payload]),
      }
    case ActionTypes.SET_NUMBER_DEPLOYED:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        deployedSales: action.payload,
        sales: state.sales,
      }
    default:
      return state
  }
}
