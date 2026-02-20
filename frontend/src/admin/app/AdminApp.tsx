import { Suspense } from "react";
import { AdminAuthProvider } from "../contexts/AdminAuthContext";
import { AdminContentProvider } from "../contexts/AdminContentContext";
import { AdminRoutes } from "../router";

export default function AdminApp() {
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
