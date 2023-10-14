import { ZuSetFn } from "@/stores/utils";
import NDK, { NDKEvent, NDKFilter, NDKSubscription } from "@nostr-dev-kit/ndk";
import { createStore } from "zustand";
import { DEFAULT_EVENT_STORE_PROPS } from "./defaults";
import { EventSet, eventSet, eventsLoaded } from "./EventSet";
import * as R from "ramda";

type SetFn = ZuSetFn<EventState>;
type GetFn = () => EventState;

export type EventStore = ReturnType<typeof createEventStore>;

export interface EventStoreProps {
  currentFilter: NDKFilter;
  eventSets: EventSet[];
}

export interface EventState extends EventStoreProps {
  subscribeEvents: (filter: NDKFilter) => NDKSubscription;
  fetchEventsS: (filter: NDKFilter) => Promise<void>;
}

export const createEventStore = (ndk2: NDK, initProps?: Partial<EventStoreProps>) => {
  return createStore<EventState>()((set, get) => ({
    ...DEFAULT_EVENT_STORE_PROPS,
    ...initProps,

    subscribeEvents: (filter: NDKFilter) => _subscribeEvents(get, set, ndk2, filter),
    fetchEventsS: (filter: NDKFilter) => _fetchEventAndStore(get, set, ndk2, filter),
  }));
};

const _subscribeEvents = (get: GetFn, set: SetFn, ndk: NDK, filter: NDKFilter): NDKSubscription => {
  const sub = ndk.subscribe(filter, {});

  sub.on("event", (ndkEv: NDKEvent) => {
    updateEventSet(get, set, filter, new Set([ndkEv]));
  });

  return sub;
};

const _fetchEventAndStore = async (get: GetFn, set: SetFn, ndk: NDK, filter: NDKFilter): Promise<void> => {
  const loadedEvents = await ndk.fetchEvents(filter);
  updateEventSet(get, set, filter, loadedEvents);
};

function updateEventSet(get: GetFn, set: SetFn, filter: NDKFilter, loadedEvents: Set<NDKEvent>) {
  const currentEventSets = get().eventSets;

  const filterMatch = (evSet: EventSet) => R.equals(evSet.nip01Filter, filter);

  const matchingSet = R.find(filterMatch, currentEventSets) || eventSet("Default", filter);

  const updatedSet = eventsLoaded(matchingSet, Array.from(loadedEvents));

  set({
    eventSets: R.without([matchingSet], currentEventSets).concat(updatedSet),
  });
}
