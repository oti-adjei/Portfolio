import { BrowserRouter, useLocation } from "react-router-dom";
import AdminApp from "./admin/app/AdminApp";
import PublicApp from "./public/app/PublicApp";

function AppShell() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return isAdminRoute ? <AdminApp /> : <PublicApp />;
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
