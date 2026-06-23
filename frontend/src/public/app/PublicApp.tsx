import { Suspense } from "react";
import { PublicContentProvider } from "../contexts/PublicContentContext";
import { PublicRoutes } from "../router";
import PageLoader from "@/components/PageLoader";

export default function PublicApp() {
  return (
    <PublicContentProvider>
      <PageLoader />
      <Suspense fallback={null}>
        <PublicRoutes />
      </Suspense>
    </PublicContentProvider>
  );
}
