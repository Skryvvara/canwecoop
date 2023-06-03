import { ApiClient } from "@/lib";
import { User } from "@/types";
import axios from "axios";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

export interface IAuthContext {
  user?: User;
  isLoading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  isLoading: false,
  logout: () => {},
});

export function AuthContextProvider(props: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const getUser = useCallback(() => {
    setIsLoading(true);
    ApiClient.get("auth", {
      withCredentials: true,
    })
      .then((res) => {
        if (res.status != 200) return;

        setUser(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((err) => console.info(err));
  }, []);

  const logout = useCallback(() => {
    ApiClient.delete("auth", {
      withCredentials: true,
    })
      .then((res) => {
        if (res.status != 200) return;
        setUser(undefined);
      })
      .catch((err) => console.info(err));
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}
