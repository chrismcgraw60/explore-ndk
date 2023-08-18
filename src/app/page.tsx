'use client'

import FlowNDKProvider from "@/components/FlowNDKProvider";
import NostrEvents from "@/components/NostrEvents";
import NostrProfile from "@/components/NostrProfile";

export default function Home() {
  return (
    <FlowNDKProvider>
        <NostrProfile></NostrProfile>
      </FlowNDKProvider>
  )
}
