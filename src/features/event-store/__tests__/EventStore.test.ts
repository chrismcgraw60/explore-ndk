import "websocket-polyfill";
import * as td from "testdouble";

import { createEventStore } from "@/features/event-store/EventStore";
import NDK, { NDKEvent } from "@nostr-dev-kit/ndk";
import { DEFAULT_EVENT_FILTER } from "../defaults";
import { eventsToIds, sampleEvents } from "./testData";

const TEST_TIMEOUT = 10000;

describe("EventStore", () => {
  const ndkMock = td.object<NDK>();
  const [ev1, ev2, ev3, ev4] = sampleEvents(ndkMock);

  test(
    "fetchEvents into an empty store",
    async () => {
      td.when(ndkMock.fetchEvents(DEFAULT_EVENT_FILTER)).thenResolve(new Set<NDKEvent>([ev1, ev2]));

      const bs = createEventStore(ndkMock);

      await bs.getState().fetchEventsS(DEFAULT_EVENT_FILTER);

      expect(bs.getState().eventSets.length).toEqual(1);
      const loadedEventSet = bs.getState().eventSets[0];
      expect(loadedEventSet.events.length).toEqual(2);
    },
    TEST_TIMEOUT
  );

  test(
    "fetchEvents into an empty store and then fetch more",
    async () => {
      td.when(ndkMock.fetchEvents(DEFAULT_EVENT_FILTER)).thenResolve(
        new Set<NDKEvent>([ev2, ev4]),
        new Set<NDKEvent>([ev3, ev1])
      );

      const bs = createEventStore(ndkMock);

      await bs.getState().fetchEventsS(DEFAULT_EVENT_FILTER);

      expect(bs.getState().eventSets.length).toEqual(1);
      const loadedEventSet1 = bs.getState().eventSets[0];
      expect(loadedEventSet1.events.length).toEqual(2);

      await bs.getState().fetchEventsS(DEFAULT_EVENT_FILTER);
      expect(bs.getState().eventSets.length).toEqual(1);
      const loadedEventSet2 = bs.getState().eventSets[0];
      expect(loadedEventSet2.events.length).toEqual(4);

      expect(eventsToIds(loadedEventSet2)).toEqual([ev4.id, ev3.id, ev2.id, ev1.id]);
    },
    TEST_TIMEOUT
  );
});
