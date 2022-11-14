import Connected from "pages/Connected"
import Public from "pages/Public"
import ProjectSetup from "pages/Public/ProjectSetup"
import SaleDetails from "pages/Public/SaleDetails"

const connectedRoutes = [{ path: "/home", component: Connected }]

const publicRoutes = [
  { path: "/", component: Public },
  { path: "/project-setup", component: ProjectSetup },
  { path: "/sale/:id", component: SaleDetails },
]

export { connectedRoutes, publicRoutes }
