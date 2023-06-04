import { ApiClient, getClientConfig } from "@/lib";
import { User } from "@/types";
import { useRouter } from "next/router";
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
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  isLoading: false,
  login: () => {},
  logout: () => {},
});

export function AuthContextProvider(props: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getUser = useCallback(() => {
    setIsLoading(true);
    ApiClient?.get("/auth", {
      withCredentials: true,
    })
      .then((res: any) => {
        if (res.status != 200) return;

        setUser(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((err: Error) => console.info(err));
  }, []);

  const login = useCallback(async () => {
    const { apiBaseUrl } = await getClientConfig();
    const url = apiBaseUrl + `/auth/login`;
    router.push(url);
  }, [router]);

  const logout = useCallback(() => {
    ApiClient?.delete("/auth", {
      withCredentials: true,
    })
      .then((res: any) => {
        if (res.status != 200) return;
        setUser(undefined);
      })
      .catch((err: Error) => console.info(err));
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, login }}>
      {props.children}
    </AuthContext.Provider>
  );
}
