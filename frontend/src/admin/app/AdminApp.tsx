import { Suspense } from "react";
import { AdminAuthProvider } from "../contexts/AdminAuthContext";
import { AdminContentProvider } from "../contexts/AdminContentContext";
import { AdminRoutes } from "../router";
import { useAdminInstallMeta } from "./useAdminInstallMeta";

export default function AdminApp() {
  useAdminInstallMeta();

  return (
    <AdminAuthProvider>
      <AdminContentProvider>
        <Suspense fallback={null}>
          <AdminRoutes />
        </Suspense>
      </AdminContentProvider>
    </AdminAuthProvider>
  );
}
