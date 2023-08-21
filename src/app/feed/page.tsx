'use client'
import FlowNDKProvider from "@/components/FlowNDKProvider";
import NostrEvents from "@/components/NostrEvents";

export default function Feeds() {
    return (
        <FlowNDKProvider>
            <NostrEvents></NostrEvents>
        </FlowNDKProvider>
    )
  }