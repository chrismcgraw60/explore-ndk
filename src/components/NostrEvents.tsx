'use client'

import { useState, useEffect, JSX, useCallback } from 'react';
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { NDKFilter, NDKEvent } from "@nostr-dev-kit/ndk";
import { NPub07, useUserProfileStore } from '@/features/user-profile/UserProfileStore'
import _ from "lodash";
import { JsonViewerDynamic } from './JsonViewerDynamic';
  
interface NostrEventProps {
    filter?: NDKFilter;
    currentEventId?: string;
}

const defaultFilter: NDKFilter = {
    kinds: [1],
    "#t": ["ndk"],
};

const NostrEvents = ({filter, currentEventId} : NostrEventProps) => {

    const [isLoading, setLoading] = useState<boolean>(false);
    const [events, setEvents] = useState<NDKEvent[] | null>(null);
    const { ndk } = useNDK();

    const fetchEvents = useCallback (async (filter: NDKFilter) : Promise<NDKEvent[]> => {
        if (ndk === undefined) return [];

        return new Promise((resolve) => {

            const events: Map<string, NDKEvent> = new Map();

            const relaySetSubscription = ndk.subscribe(filter, {
                closeOnEose: true,
            });

            relaySetSubscription.on("event", (event: NDKEvent) => {
                event.ndk = ndk;
                events.set(event.tagId(), event);
            });

            relaySetSubscription.on("eose", () => {
                setTimeout(() => resolve(Array.from(new Set(events.values()))), 500);
            });
        });
    }, [ndk]); 

    const fetch = useCallback (
        async (filter : NDKFilter) => {
            setLoading(true);
            const loadedEvents = await fetchEvents(filter);
            setEvents(loadedEvents);
            setLoading(false);
        }, [fetchEvents]
    );

    useEffect(() => {
        const filterToApply: NDKFilter = filter ? filter : defaultFilter;
        fetch(filterToApply);
    }, [fetch, fetchEvents, filter])

    const eventDivs: JSX.Element[] = [];
    _.forEach(events, (ev) => {
        const isSelected = (ev.id === currentEventId);
        eventDivs.push(
            <div className='p-1' id={ev.id} key={ev.id}>
                <JsonViewerDynamic ndkEvent={ev.rawEvent()} isSelected={isSelected}/>
            </div>);
    })

    function refreshEvents(): void {
        filter && fetch(filter);
    }

    return <>
        <div><button onClick={() => refreshEvents()}>Refresh</button></div>
        <div className='overflow-y-auto overflow-x-hidden' >
            {isLoading ? "Loading..." : eventDivs}
        </div>
    </>
    
}

export default NostrEvents;