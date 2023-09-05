'use client'
import NostrEvents from "@/components/NostrEvents";

export default function Feeds() {
    return (
        <div className="overflow-y-auto">
            <NostrEvents></NostrEvents>
        </div>
    )
  }