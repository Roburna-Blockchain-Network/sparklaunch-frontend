import axios from "axios"

const BaseApi = axios.create({
  baseURL: "https://sparklaunch-backend.herokuapp.com/sale/",
  //baseURL: "http://localhost:3001/sale",
})

export default BaseApi
