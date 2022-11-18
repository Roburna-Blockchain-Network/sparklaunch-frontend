import axios from "axios"

const BaseApi = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}sale`,
})

export default BaseApi
