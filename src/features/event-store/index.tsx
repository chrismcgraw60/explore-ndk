"use client";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react";
import {
  EventState,
  EventStore,
  createEventStore,
} from "@/features/event-store/EventStore";
import { useStore } from "zustand";

const EventStoreContext = createContext<EventStore | null>(null);

function EventStoreProvider({ children }: PropsWithChildren) {
  // <-- use NDK here
  const storeRef = useRef<EventStore>();
  if (!storeRef.current) {
    storeRef.current = createEventStore();
  }

  return (
    <EventStoreContext.Provider value={storeRef.current}>
      {children}
    </EventStoreContext.Provider>
  );
}

function useEventStoreContext<T>(selector: (state: EventState) => T): T {
  const store = useContext(EventStoreContext);
  if (!store) throw new Error("Missing EventStoreProvider in the tree");
  return useStore(store, selector);
}

export { EventStoreProvider, useEventStoreContext };
