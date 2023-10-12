"use client";

import { useState, useEffect, JSX } from "react";
import { useNDK } from "@/hooks/useNDK";
import { NDKFilter } from "@nostr-dev-kit/ndk";
import _ from "lodash";
import dynamic from "next/dynamic";
import { useEventStoreContext } from "@/features/event-store";

const JsonViewerDyn = dynamic(() => import("@/components/JsonViewer"), {
  ssr: false,
});

interface NostrEventProps {
  filter?: NDKFilter;
  currentEventId?: string;
}

const NostrEvents = ({ filter, currentEventId }: NostrEventProps) => {
  const fetchEvents = useEventStoreContext((s) => s.fetchEventsS);
  const ndkEvents = useEventStoreContext((s) => s.events);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [isInitLoaded, setInitLoaded] = useState<boolean>(false);
  const { ndk } = useNDK();

  useEffect(() => {
    async function load() {
      if (ndk && !isInitLoaded && filter) {
        try {
          setLoading(true);
          setInitLoaded(true);
          await fetchEvents(ndk, filter);
        } finally {
          setLoading(false);
        }
      }
    }
    load();
  }, [fetchEvents, filter, isInitLoaded, ndk]);

  const eventDivs: JSX.Element[] = [];
  _.forEach(ndkEvents, (ev, i) => {
    const isSelected = ev.id === currentEventId;
    eventDivs.push(
      <div className="p-1" id={ev.id} key={`${ev.id}.${i}`}>
        <JsonViewerDyn ndkEvent={ev.rawEvent()} isSelected={isSelected} />
      </div>
    );
  });

  return (
    <>
      <div className="overflow-y-auto overflow-x-hidden">{isLoading ? "Loading..." : eventDivs}</div>
    </>
  );
};

export default NostrEvents;
