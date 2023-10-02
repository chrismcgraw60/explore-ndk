'use client';

import { NDKProvider } from "@nostr-dev-kit/ndk-react";
import { PropsWithChildren } from "react";

const relayUrls = [
  "wss://relay.damus.io",
  // "wss://relay.snort.social",
];

/**
 * Wraps a pre-configured NDKProvider.
 */
export default function FlowNDKProvider({ children }: PropsWithChildren) {

  return <NDKProvider relayUrls={relayUrls}>{children}</NDKProvider>;
}
