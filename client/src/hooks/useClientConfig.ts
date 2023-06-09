import { ClientConfig, IClientConfig } from "@/api/getClientConfig";
import { useEffect, useState } from "react";

export function useClientConfig() {
  const [config, setConfig] = useState<IClientConfig>({
    apiBaseUrl: "",
    socials: {
      mail: "",
      linkedIn: "",
      twitter: "",
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setConfig(ClientConfig);
  }, []);

  return { ...config };
}
