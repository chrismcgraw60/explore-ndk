'use client'

import FlowNDKProvider from "@/components/FlowNDKProvider";
import NostrProfile from "@/components/NostrProfile";

export default function Home() {
  return (
    <FlowNDKProvider>
        <NostrProfile></NostrProfile>
      </FlowNDKProvider>
  )
}
