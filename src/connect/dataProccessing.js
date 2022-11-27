import { ethers } from "ethers"

import { factoryABI, saleABI, adminABI, testABI } from "./abi"
import moment from "moment"
import { formatEther } from "ethers/lib/utils"

const backendURL = `${process.env.REACT_APP_BACKEND_URL}`

const ADMIN_ADDRESS = "0x45B1379Be4A4f389B67D7Ad41dB5222f7104D26C"
const FACTORY_ADDRESS = "0x863B229F7d5e41D76C49bC9922983B0c3a096CDF"

const { ethereum } = window
export let provider = ethers.getDefaultProvider(
  "https://preseed-testnet-1.roburna.com/"
)

const FactoryContract = new ethers.Contract(
  FACTORY_ADDRESS,
  factoryABI,
  provider
)

const AdminContract = new ethers.Contract(ADMIN_ADDRESS, adminABI, provider)

export const fetchAllSales = async chainId => {
  if (typeof chainId == "undefined") {
    return []
  }
  try {
    const response = await fetch(`${backendURL}chain/${chainId}`)
    const res = await response.json()

    return res.data
  } catch (e) {
    return []
  }
}

export const saveData = async values => {
  try {
    const input = JSON.stringify({
      id: values.id,
      name: values.name,
      address: values.address,
      start: values.startdt,
      end: values.enddt,
      chainId: values.chainId,
      tokenAddress: values.tokenAddress,
      tokenName: values.tokenName,
      saleLinks: {
        logo: values.logo,
        fb: values.facebook,
        git: values.githube,
        insta: values.instagram,
        reddit: values.reddit,
        web: values.website,
        twitter: values.twitter,
        telegram: values.telegram,
        discord: values.discord,
        youtube: values.youtube,
      },
      description: values.description,
      featured: false,
      featuredImage: "",
      visited: 0,
      token: {
        name: values.tokenName,
        decimals: values.tokenName,
      },
    })

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: input,
    }

    const response = await fetch(`${backendURL}chain`, requestOptions)
    const data = await response.json()
    let id = await data._id

    return true
  } catch (e) {
    // console.log("Err: ", e.message)
    return false
  }

  // // console.log(data)
}
