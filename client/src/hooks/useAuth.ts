import { AuthContext } from "@/context";
import { useContext } from "react";

export function useAuth() {
  const authContext = useContext(AuthContext);
  return { ...authContext };
}
