import * as ActionTypes from "./ActionTypes"
const LAST_CHAIN = localStorage.getItem("lastChainSelected")
export const Sales = (
  state = {
    isLoading: false,
    isInit: false,
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
        isInit: true,
        errMess: null,
        deployedSales: state.deployedSales,
        sales: action.payload,
      }

    case ActionTypes.UPDATE_SALE:
      newSale = []
      state.sales.forEach(sale => {
        if (sale.id == action.payload.id) {
          let x = sale
          x.status = action.payload.status
          newSale.push(x)
        } else {
          newSale.push(sale)
        }
      })

    case ActionTypes.UPDATE_SALE_TIME:
      let newSale = []
      state.sales.forEach(sale => {
        if (sale.address == action.payload.address) {
          let x = sale
          x.start = action.payload.start
          x.end = action.payload.end
          newSale.push(x)
        } else {
          newSale.push(sale)
        }
      })
      // console.log(newSale)
      return {
        ...state,
        isLoading: false,
        isInit: true,
        errMess: null,
        deployedSales: state.deployedSales,
        sales: state.sales,
      }

    case ActionTypes.ADD_SALE:
      return {
        ...state,
        isLoading: false,
        isInit: true,
        errMess: null,
        deployedSales: state.deployedSales + 1,
        sales: state.sales.concat([action.payload]),
      }

    case ActionTypes.SET_NUMBER_DEPLOYED:
      return {
        ...state,
        isLoading: false,
        isInit: true,
        errMess: null,
        deployedSales: action.payload,
        sales: state.sales,
      }

    case ActionTypes.CLEAR_SALE:
      return {
        ...state,
        isLoading: false,
        isInit: false,
        errMess: null,
        deployedSales: state.deployedSales,
        sales: state.sales,
      }
    default:
      return state
  }
}
export const User = (
  state = {
    isLogin: false,
    isAdmin: false,
  },
  action
) => {
  switch (action.type) {
    case ActionTypes.SET_LOGIN_STATUS:
      return {
        ...state,
        isLogin: action.payload,
      }
    default:
      return state
  }
}
