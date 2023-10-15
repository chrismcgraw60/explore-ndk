import { ZuSetFn } from "@/stores/utils";
import NDK, { NDKEvent, NDKFilter, NDKSubscription } from "@nostr-dev-kit/ndk";
import { createStore } from "zustand";
import { DEFAULT_EVENT_STORE_PROPS } from "./defaults";
import { EventSet, eventSet, eventsLoaded } from "./EventSet";
import * as R from "ramda";
import { produce } from "immer";

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
  isLoading: (filter: NDKFilter) => boolean;
}

export const createEventStore = (ndk2: NDK, initProps?: Partial<EventStoreProps>) => {
  return createStore<EventState>()((set, get) => ({
    ...DEFAULT_EVENT_STORE_PROPS,
    ...initProps,

    subscribeEvents: (filter: NDKFilter) => _subscribeEvents(get, set, ndk2, filter),
    fetchEventsS: (filter: NDKFilter) => _fetchEventAndStore(get, set, ndk2, filter),
    isLoading: (filter: NDKFilter) => _isLoading(get, filter),
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
  const matchingSet = findExistingEventSetOrCreateNew(get, filter);
  const updatedSet = produce(matchingSet, (draft) => {
    draft.isLoading = true;
  });

  set({
    eventSets: R.without([matchingSet], get().eventSets).concat(updatedSet),
  });

  const loadedEvents = await ndk.fetchEvents(filter);

  updateEventSet(get, set, filter, loadedEvents);
};

function _isLoading(get: GetFn, filter: NDKFilter): boolean {
  const eventSet = findExistingEventSetOrCreateNew(get, filter);
  return eventSet.isLoading;
}

function findExistingEventSetOrCreateNew(get: GetFn, filter: NDKFilter) {
  const filterMatch = (evSet: EventSet) => R.equals(evSet.nip01Filter, filter);
  return R.find(filterMatch, get().eventSets) || eventSet("Default", filter);
}

function updateEventSet(get: GetFn, set: SetFn, filter: NDKFilter, loadedEvents: Set<NDKEvent>) {
  const matchingSet = findExistingEventSetOrCreateNew(get, filter);
  const updatedSet = eventsLoaded(matchingSet, Array.from(loadedEvents));

  set({
    eventSets: R.without([matchingSet], get().eventSets).concat(updatedSet),
  });
}
