import "websocket-polyfill";
import * as td from "testdouble";

import { createEventStore } from "@/features/event-store/EventStore";
import NDK, { NDKEvent, NDKFilter, NostrEvent } from "@nostr-dev-kit/ndk";

/** Build an event for testing purposes. */
export function buildNostrEvent(params: Partial<NostrEvent>): NostrEvent {
  return {
    id: "",
    kind: 1,
    pubkey: "",
    created_at: 0,
    content: "",
    tags: [],
    sig: "",
    ...params,
  };
}

function buildNdkEvent(ndk: NDK, params: Partial<NostrEvent>): NDKEvent {
  const nostrEvent = buildNostrEvent(params);
  return new NDKEvent(ndk, nostrEvent);
}

const TEST_TIMEOUT = 10000;

describe("NDK sync", () => {
  const defaultFilter: NDKFilter = {
    kinds: [1],
    "#t": ["ndk"],
  };

  test(
    "fetchEvents",
    async () => {
      const ndkMock = td.object<NDK>();

      const event1 = buildNdkEvent(ndkMock, {
        id: "123",
        pubkey: "abc",
        created_at: 150,
        tags: [["p", "my_key"]],
      });

      const event2 = buildNdkEvent(ndkMock, {
        id: "345",
        pubkey: "abc",
        created_at: 200,
        tags: [["p", "my_key"]],
      });

      td.when(ndkMock.fetchEvents(defaultFilter)).thenResolve(new Set<NDKEvent>([event1, event2]));

      const bs = createEventStore();

      await bs.getState().fetchEventsS(ndkMock, defaultFilter);

      expect(bs.getState().events.length).toEqual(2);
    },
    TEST_TIMEOUT
  );
});
