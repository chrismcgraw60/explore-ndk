"use client";

import { PropsWithChildren, createContext, useContext } from "react";
import NDK from "@nostr-dev-kit/ndk";
import NDKInstance from "@/hooks/useNDK/instance";

export const relayUrls = ["wss://relay.damus.io", "wss://relay.snort.social"];

interface NDKContextProps {
  ndk: NDK | undefined;
}

const NDKContext = createContext<NDKContextProps>({
  ndk: undefined,
});

const NDKProvider = ({ children }: PropsWithChildren) => {
  const { ndk } = NDKInstance(relayUrls);

  return <NDKContext.Provider value={{ ndk }}>{children}</NDKContext.Provider>;
};

const useNDK = () => {
  const context = useContext(NDKContext);
  if (context === undefined) {
    throw new Error("import NDKProvider to use useNDK");
  }
  return context;
};

export { NDKProvider, useNDK };
