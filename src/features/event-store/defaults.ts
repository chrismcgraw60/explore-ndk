import { NDKFilter } from "@nostr-dev-kit/ndk";
import { EventStoreProps } from "./EventStore";

export const DEFAULT_EVENT_FILTER: NDKFilter = {
  kinds: [1],
  "#t": ["ndk"],
};

export const DEFAULT_EVENT_STORE_PROPS: EventStoreProps = {
  currentFilter: DEFAULT_EVENT_FILTER,
  eventSets: [],
};
