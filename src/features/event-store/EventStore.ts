import { ZuSetFn } from "@/stores/utils";
import NDK, { NDKEvent, NDKFilter, NDKSubscription } from "@nostr-dev-kit/ndk";
import { createStore } from "zustand";
import { DEFAULT_EVENT_STORE_PROPS } from "./defaults";

type SetFn = ZuSetFn<EventState>;
type GetFn = () => EventState;

export type EventStore = ReturnType<typeof createEventStore>;

export interface EventStoreProps {
  currentFilter: NDKFilter;
  events: NDKEvent[];
}

export interface EventState extends EventStoreProps {
  subscribeEvents: (ndk: NDK, filter: NDKFilter) => NDKSubscription;
  fetchEventsS: (ndk: NDK, filter: NDKFilter) => Promise<void>;
}

export const createEventStore = (ndk2: NDK, initProps?: Partial<EventStoreProps>) => {
  return createStore<EventState>()((set, get) => ({
    ...DEFAULT_EVENT_STORE_PROPS,
    ...initProps,

    subscribeEvents: (ndk: NDK, filter: NDKFilter) => _subscribeEvents(get, set, ndk2, filter),
    fetchEventsS: (ndk: NDK, filter: NDKFilter) => _fetchEventAndStore(get, set, ndk2, filter),
  }));
};

const _subscribeEvents = (get: GetFn, set: SetFn, ndk: NDK, filter: NDKFilter): NDKSubscription => {
  const sub = ndk.subscribe(filter, {});

  sub.on("event", (ndkEv: NDKEvent) => {
    const currentEvents = get().events;
    set({
      events: [...currentEvents, ndkEv],
    });
  });

  return sub;
};

const _fetchEventAndStore = async (get: GetFn, set: SetFn, ndk: NDK, filter: NDKFilter): Promise<void> => {
  const fetchedEvents = await ndk.fetchEvents(filter);
  const currentEvents = get().events;
  set({
    events: [...currentEvents, ...Array.from(fetchedEvents.values())],
  });
};
