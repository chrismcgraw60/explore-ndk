import "websocket-polyfill";

import { createEventStore } from "@/features/event-store/EventStore";
import NDK from "@nostr-dev-kit/ndk";
import { DEFAULT_EVENT_FILTER } from "../defaults";

const TEST_TIMEOUT = 10000;
const assertAfter = (delay: number, fn: () => boolean) => {
  return new Promise((resolve) => setTimeout(() => resolve(fn()), delay));
};

describe("Populating Events", () => {
  const relayUrls = ["wss://relay.damus.io", "wss://relay.snort.social"];

  let ndk = new NDK({
    explicitRelayUrls: relayUrls,
  });

  beforeEach(async () => {
    ndk = new NDK({
      explicitRelayUrls: relayUrls,
    });
    await ndk.connect();
  });

  afterEach(() => relayUrls.map((relay) => ndk.pool.removeRelay(relay)));

  test(
    "using subscribe",
    async () => {
      const bs = createEventStore(ndk);

      bs.getState().subscribeEvents(DEFAULT_EVENT_FILTER);

      const result = await assertAfter(2000, () => {
        console.log("Subscribed event count: " + bs.getState().eventSets.length);
        return bs.getState().eventSets.length > 0;
      });

      expect(result).toBeTruthy();
    },
    TEST_TIMEOUT
  );

  test(
    "using fetchEvents",
    async () => {
      const bs = createEventStore(ndk);

      await bs.getState().fetchEvents(DEFAULT_EVENT_FILTER);

      console.log("Returned event count:" + bs.getState().eventSets.length);

      expect(bs.getState().eventSets.length).toBeGreaterThan(0);
    },
    TEST_TIMEOUT
  );
});
