import { useAuth } from "@/hooks";
import { PropsWithChildren } from "react";
import { LoadingSpinner } from "./loadingSpinner";

function CenteredLoadingSpinner() {
  return (
    <div
      className="container"
      style={{
        display: "grid",
        placeItems: "center",
      }}
    >
      <LoadingSpinner />
    </div>
  );
}

export function Protected(props: PropsWithChildren) {
  const { user, isLoading, login } = useAuth();

  if (isLoading) return <CenteredLoadingSpinner />;
  if (!user && !isLoading) {
    login();
    return <CenteredLoadingSpinner />;
  }

  return <>{props.children}</>;
}
