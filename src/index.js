import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import { NotificationContainer } from "react-notifications"

import { Provider } from "react-redux"
import {
  BSCTestnet,
  DAppProvider,
  // DEFAULT_SUPPORTED_CHAINS,
} from "@usedapp/core"
import { getDefaultProvider } from "ethers"

import store from "./store"
import { RbaChain } from "constants/RbaChain"
import "react-notifications/lib/notifications.css"
import "owl.carousel/dist/assets/owl.carousel.css"
import "owl.carousel/dist/assets/owl.theme.default.css"

const config = {
  readOnlyChainId: [BSCTestnet.chainId],
  readOnlyUrls: {
    //[RbaChain.chainId]: "https://preseed-testnet-1.roburna.com/",
     [BSCTestnet.chainId]: "https://rpc.ankr.com/bsc_testnet_chapel",
  },
  networks: [BSCTestnet],
  noMetamaskDeactivate: true,
}

const app = (
  <DAppProvider config={config}>
    <Provider store={store}>
      <BrowserRouter>
        Sparklaunch
      </BrowserRouter>
    </Provider>
  </DAppProvider>
)

ReactDOM.render(app, document.getElementById("root"))
// serviceWorker.unregister()

