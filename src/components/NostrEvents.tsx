"use client";

import { useState, useEffect, JSX } from "react";
import { useNDK } from "@/hooks/useNDK";
import * as R from "ramda";
import dynamic from "next/dynamic";
import { useEventStoreContext } from "@/features/event-store";
import { NDKFilter } from "@nostr-dev-kit/ndk";

const JsonViewerDyn = dynamic(() => import("@/components/JsonViewer"), {
  ssr: false,
});

interface NostrEventProps {
  filter?: NDKFilter;
  currentEventId?: string;
}

const NostrEvents = ({ filter, currentEventId }: NostrEventProps) => {
  const fetchEvents = useEventStoreContext((s) => s.fetchEventsS);
  const isFilterLoading = useEventStoreContext((s) => s.isLoading);
  const eventSets = useEventStoreContext((s) => s.eventSets);

  const isLoading = filter && isFilterLoading(filter);
  const [isInitLoaded, setInitLoaded] = useState<boolean>(false);
  const { ndk } = useNDK();

  useEffect(() => {
    async function load() {
      if (ndk && !isInitLoaded && filter) {
        setInitLoaded(true);
        await fetchEvents(filter);
      }
    }
    load();
  }, [fetchEvents, filter, isInitLoaded, ndk]);

  const eventDivs: JSX.Element[] = [];

  if (!R.isEmpty(eventSets)) {
    const events = eventSets[0].events;

    events.forEach((ev, i) => {
      const isSelected = ev.id === currentEventId;
      eventDivs.push(
        <div className="p-1" id={ev.id} key={`${ev.id}.${i}`}>
          <JsonViewerDyn ndkEvent={ev.rawEvent()} isSelected={isSelected} />
        </div>
      );
    });
  }

  return (
    <>
      <div className="overflow-y-auto overflow-x-hidden">{isLoading ? "Loading..." : eventDivs}</div>
    </>
  );
};

export default NostrEvents;
