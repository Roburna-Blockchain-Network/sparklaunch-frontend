import Connected from "pages/Connected"
import Public from "pages/Public"
import ProjectSetup from "pages/Public/ProjectSetup"
import TokenLocker from "pages/Public/TokenLocker"
import SaleDetails from "pages/Public/SaleDetails"

const connectedRoutes = [
  { path: "/thispathwillnevershow", component: Connected },
]

const publicRoutes = [
  { path: "/", component: Public },
  { path: "/pools", component: Public },
  { path: "/project-setup", component: ProjectSetup },
  { path: "/token-locker", component: TokenLocker },
  { path: "/sale/:id", component: SaleDetails },
]

export { connectedRoutes, publicRoutes }
