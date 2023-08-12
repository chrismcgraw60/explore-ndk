'use client'

import { NDKProvider } from "@nostr-dev-kit/ndk-react";
import { PropsWithChildren } from "react";

const relayUrls = [
    "wss://relay.damus.io",
    "wss://relay.snort.social",
    "wss://purplepag.es",
];

export default function FlowNDKProvider({children} : PropsWithChildren) {
  return (
      <NDKProvider relayUrls={relayUrls}>
        {children}
    </NDKProvider>
  )
}