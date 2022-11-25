import Connected from "pages/Connected"
import Public from "pages/Public"
import ProjectSetup from "pages/Public/ProjectSetup"
import TokenLocker from "pages/Public/TokenLocker"
import SaleDetails from "pages/Public/SaleDetails"
import StaticLocker from "pages/Public/StaticLocker"
import LockerNotFound from "pages/Public/LockerNotFound"

const connectedRoutes = [
  { path: "/thispathwillnevershow", component: Connected },
]

const publicRoutes = [
  { path: "/", component: Public },
  { path: "/pools", component: Public },
  { path: "/project-setup", component: ProjectSetup },
  { path: "/token-locker", component: StaticLocker },
  { path: "/token-locker/:address", component: TokenLocker },
  { path: "/token-locker-notfound", component: LockerNotFound },
  { path: "/sale/:id", component: SaleDetails },
]

export { connectedRoutes, publicRoutes }
