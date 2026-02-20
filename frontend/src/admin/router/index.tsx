import { useRoutes } from "react-router-dom";
import routes from "./config";

export function AdminRoutes() {
  return useRoutes(routes);
}
