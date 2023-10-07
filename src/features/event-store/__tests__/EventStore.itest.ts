
import 'websocket-polyfill'

import { createEventStore, } from '@/features/event-store/EventStore';
import NDK, { NDKFilter } from '@nostr-dev-kit/ndk';

const TEST_TIMEOUT = 10000;
const assertAfter = (delay: number, fn: ()=>boolean) => {
     return new Promise(resolve => setTimeout(() => resolve(fn()), delay));
}

describe ('NDK sync', () => {

     const relayUrls = [
          "wss://relay.damus.io",
          "wss://relay.snort.social",
          ];
     
     const defaultFilter: NDKFilter = {
          kinds: [1],
          "#t": ["ndk"],
          };

     let ndk = new NDK({
          explicitRelayUrls: relayUrls
     });

     beforeEach( async () => {
          ndk = new NDK({
               explicitRelayUrls: relayUrls
          });
          await ndk.connect();
     });

     afterEach(() => relayUrls.map(relay => ndk.pool.removeRelay(relay)));

     test('subscribe', async () => {  
          
          const bs = createEventStore();

          bs.getState().fetchEvents(ndk, defaultFilter);

          const result = await assertAfter(2000, () => {
               console.log("Subscribed event count: " + bs.getState().events.length);
               return bs.getState().events.length > 0;
          });

          expect(result).toBeTruthy();
     
     }, TEST_TIMEOUT);

     test('fetchEvents', async () => {   
     
          const bs = createEventStore();

          await bs.getState().fetchEventsS(ndk, defaultFilter);

          console.log("Returned event count:" + bs.getState().events.length);
     
     }, TEST_TIMEOUT);
     
});
