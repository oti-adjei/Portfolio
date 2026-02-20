import { Suspense } from "react";
import { PublicContentProvider } from "../contexts/PublicContentContext";
import { PublicRoutes } from "../router";

export default function PublicApp() {
  return (
    <PublicContentProvider>
      <Suspense fallback={null}>
        <PublicRoutes />
      </Suspense>
    </PublicContentProvider>
  );
}
