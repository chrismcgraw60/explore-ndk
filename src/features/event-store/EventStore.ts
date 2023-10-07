import NDK, { NDKEvent, NDKFilter, NDKSubscription } from '@nostr-dev-kit/ndk'
import { createStore } from 'zustand'

type ZuSetFn<T> = (
    partial: T | Partial<T> | ((state: T) => T | Partial<T>), 
    replace?: boolean | undefined) => void;

type SetFn = ZuSetFn<EventState>;
type GetFn = () => EventState;

interface EventStoreProps {
    eventCount: number;
    events: NDKEvent[];
}

const DEFAULT_PROPS: EventStoreProps = {
    eventCount: 0,
    events: []
}

export interface EventState extends EventStoreProps {
  inc: () => void;
  fetchEvents: (ndk: NDK, filter: NDKFilter) => NDKSubscription ;
  fetchEventsS: (ndk: NDK, filter: NDKFilter) => Promise<void> ;
}

export type EventStore = ReturnType<typeof createEventStore>

export const createEventStore = (initProps?: Partial<EventStoreProps>) => {

    return createStore<EventState>()((set, get) => ({
        ...DEFAULT_PROPS,
        ...initProps,

        inc: () => set(_inc),
        fetchEvents: (ndk: NDK, filter: NDKFilter) => _fetchEvents(get, set, ndk, filter),
        fetchEventsS: (ndk: NDK, filter: NDKFilter) => _fetchEventsS(get, set, ndk, filter)
    }))
}

const _inc = (state: EventState) : Partial<EventState> =>  ({ eventCount: ++state.eventCount });

const _fetchEvents = (get: GetFn, set: SetFn, ndk: NDK, filter: NDKFilter) : NDKSubscription =>  {

    const sub = ndk.subscribe(filter, {});

    sub.on("event", (ndkEv: NDKEvent) => {
        
        const currentEvents = get().events;

        set({
            events: [...currentEvents, ndkEv]
        })
    });

    return sub;
}

const _fetchEventsS = async (get: GetFn, set: SetFn, ndk: NDK, filter: NDKFilter) : Promise<void> =>  {

    const fetchedEvents = await ndk.fetchEvents(filter);
    const currentEvents = get().events;

    set({
        events: [...currentEvents, ...Array.from(fetchedEvents.values())]
    })
}