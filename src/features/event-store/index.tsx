"use client";
import React, { PropsWithChildren, createContext, useContext, useRef } from "react";
import { EventState, EventStore, createEventStore } from "@/features/event-store/EventStore";
import { useStore } from "zustand";
import { useNDK } from "@/hooks/useNDK";

const EventStoreContext = createContext<EventStore | undefined>(undefined);

function EventStoreProvider({ children }: PropsWithChildren) {
  const { ndk } = useNDK();
  const storeRef = useRef<EventStore>();

  if (ndk && !storeRef.current) {
    storeRef.current = createEventStore(ndk);
  }

  return storeRef.current ? (
    <EventStoreContext.Provider value={storeRef.current}>{children}</EventStoreContext.Provider>
  ) : null;
}

function useEventStoreContext<T>(selector: (state: EventState) => T): T {
  const store = useContext(EventStoreContext);
  if (!store) throw new Error("Missing EventStoreProvider in the tree");
  return useStore(store, selector);
}

export { EventStoreProvider, useEventStoreContext };
