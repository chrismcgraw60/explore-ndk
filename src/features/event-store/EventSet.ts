import { NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { produce } from "immer";
import * as R from "ramda";

type NumberSort = (a: number, b: number) => 0 | 1 | -1;
type EventSort = (evA: NDKEvent, evB: NDKEvent) => 0 | 1 | -1;

const sortAsc: NumberSort = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const sortDesc: NumberSort = (a, b) => (b < a ? -1 : b > a ? 1 : 0);

export const sortCreatedByAsc: EventSort = (evA, evB) => {
  return sortAsc(evA.created_at || 0, evB.created_at || 0);
};

export const sortCreatedByDesc: EventSort = (evA, evB) => {
  return sortDesc(evA.created_at || 0, evB.created_at || 0);
};

export interface EventSet {
  readonly events: NDKEvent[];
  readonly eventSort: EventSort;
  readonly nip01Filter: NDKFilter;
  readonly isLoading: boolean;
  readonly lastUpdated: number;
  readonly mostRecent: number;
  readonly name: string;
}

export function eventSet(name: string, filter: NDKFilter, sort?: EventSort): EventSet {
  return {
    events: [],
    eventSort: sort || sortCreatedByDesc,
    nip01Filter: filter,
    isLoading: false,
    lastUpdated: Date.now(),
    mostRecent: 0,
    name: name,
  };
}

export function beginLoading(eventSet: EventSet): EventSet {
  return produce(eventSet, (draft) => {
    draft.isLoading = true;
  });
}

export function eventsLoaded(eventSet: EventSet, loadedEvents: NDKEvent[]): EventSet {
  const updatedEvents = mergeEventLists(eventSet.events, loadedEvents, eventSet.eventSort);
  const latestEvent = R.last(updatedEvents)?.created_at;
  const mostRecentCreatedAt = latestEvent || 0;

  return produce(eventSet, (draft) => {
    draft.events = updatedEvents;
    draft.isLoading = false;
    draft.lastUpdated = Date.now();
    draft.mostRecent = mostRecentCreatedAt;
  });
}

function mergeEventLists(existingEvents: NDKEvent[], loadedEvents: NDKEvent[], evSort: EventSort): NDKEvent[] {
  const concat = R.concat(existingEvents, loadedEvents);
  const unique = R.uniqBy((ev) => ev.id , concat);
  const sorted = R.sort(evSort, unique);
  return sorted;
}
