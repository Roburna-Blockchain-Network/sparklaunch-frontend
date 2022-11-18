import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"

import { Provider } from "react-redux"
import {
  BSCTestnet,
  DAppProvider,
  // DEFAULT_SUPPORTED_CHAINS,
} from "@usedapp/core"
import { getDefaultProvider } from "ethers"

import store from "./store"
import { RbaChain } from "constants/RbaChain"

const config = {
  readOnlyChainId: RbaChain.chainId,
  readOnlyUrls: {
    [RbaChain.chainId]: "https://preseed-testnet-1.roburna.com/",
    [BSCTestnet.chainId]: "https://rpc.ankr.com/bsc_testnet_chapel",
  },
  networks: [BSCTestnet, RbaChain],
}

const app = (
  <DAppProvider config={config}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </DAppProvider>
)

ReactDOM.render(app, document.getElementById("root"))
serviceWorker.unregister()
