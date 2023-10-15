import NDK from "@nostr-dev-kit/ndk";
import { beginLoading, eventSet, eventsLoaded, sortCreatedByAsc } from "../EventSet";
import * as td from "testdouble";
import { emptyFilter, eventsToIds, sampleEvents } from "./testData";

describe("EventSet", () => {
  const ndkMock = td.object<NDK>();
  const [ev1, ev2, ev3, ev4] = sampleEvents(ndkMock);

  test("should initialise with name", () => {
    const es = eventSet("foo", emptyFilter());

    expect(es.name).toEqual("foo");
    expect(es.isLoading).toBe(false);
    expect(es.nip01Filter).toEqual(emptyFilter());
  });

  test("should indicate isLoading ", () => {
    const es = eventSet("foo", emptyFilter());
    expect(beginLoading(es).isLoading).toBe(true);
  });

  test("should add the submitted events to an empty set", () => {
    const es = eventSet("foo", emptyFilter());

    const esUpdated = eventsLoaded(es, [ev1]);

    expect(esUpdated.events).toHaveLength(1);
    expect(esUpdated.isLoading).toBe(false);
    expect(esUpdated.mostRecent).toEqual(ev1.created_at);
    expect(es.nip01Filter).toEqual(emptyFilter());
  });

  test("should maintain default DESC sort order of submitted events", () => {
    const es = eventSet("foo", emptyFilter());

    const es1 = eventsLoaded(es, [ev3]);
    expect(eventsToIds(es1)).toEqual([ev3.id]);

    const es2 = eventsLoaded(es1, [ev2, ev4]);
    expect(eventsToIds(es2)).toEqual([ev4.id, ev3.id, ev2.id]);

    const es3 = eventsLoaded(es2, [ev1]);
    expect(eventsToIds(es3)).toEqual([ev4.id, ev3.id, ev2.id, ev1.id]);
  });

  test("should maintain specified sort order of submitted events", () => {
    const es = eventSet("foo", emptyFilter(), sortCreatedByAsc);

    const es1 = eventsLoaded(es, [ev3]);
    expect(eventsToIds(es1)).toEqual([ev3.id]);

    const es2 = eventsLoaded(es1, [ev2, ev4]);
    expect(eventsToIds(es2)).toEqual([ev2.id, ev3.id, ev4.id]);

    const es3 = eventsLoaded(es2, [ev1]);
    expect(eventsToIds(es3)).toEqual([ev1.id, ev2.id, ev3.id, ev4.id]);
  });
});
