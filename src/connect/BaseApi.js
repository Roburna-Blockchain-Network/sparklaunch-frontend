import axios from "axios"

const BaseApi = axios.create({
  // baseURL: "https://sparklaunch-backend.herokuapp.com/sale/",
  baseURL: "http://34.236.143.36/sale",
})

export default BaseApi
