import NDK, { NostrEvent, NDKEvent, NDKFilter } from "@nostr-dev-kit/ndk";
import { EventSet } from "../EventSet";
import R from "ramda";

const PubKeys = {
  Pk1: "PK1",
  Pk2: "PK2",
  Pk3: "PK3",
  Pk4: "PK4",
  Pk5: "PK5",
};

const Tags = {
  p_Pk1Tag: ["p", PubKeys.Pk1],
  p_Pk2Tag: ["p", PubKeys.Pk2],
  p_Pk3Tag: ["p", PubKeys.Pk3],
  p_Pk4Tag: ["p", PubKeys.Pk4],
  p_Pk5Tag: ["p", PubKeys.Pk5],
  t_nostr: ["t", "nostr"],
  t_flow: ["t", "flow"],
};

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

export function buildNdkEvent(ndk: NDK, params: Partial<NostrEvent>): NDKEvent {
  const nostrEvent = buildNostrEvent(params);
  return new NDKEvent(ndk, nostrEvent);
}

export function sampleEvents(ndk: NDK): NDKEvent[] {
  return [
    {
      id: "123",
      pubkey: PubKeys.Pk1,
      created_at: 150,
      tags: [Tags.p_Pk2Tag, Tags.t_nostr],
    },
    {
      id: "345",
      pubkey: PubKeys.Pk2,
      created_at: 200,
      tags: [Tags.p_Pk1Tag, Tags.t_flow],
    },
    {
      id: "678",
      pubkey: PubKeys.Pk1,
      created_at: 250,
      tags: [Tags.p_Pk4Tag, Tags.t_flow],
    },
    {
      id: "910",
      pubkey: PubKeys.Pk3,
      created_at: 300,
      tags: [Tags.p_Pk1Tag, Tags.t_flow, Tags.t_nostr],
    },
  ].map((ev) => buildNdkEvent(ndk, ev));
}

export function emptyFilter(): NDKFilter {
  return {};
}

export const eventsToIds = (es: EventSet) => R.map((ev: NDKEvent) => ev.id, es.events);
