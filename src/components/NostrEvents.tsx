'use client'

import { useState, useEffect, JSX } from 'react';
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { NDKFilter, NDKEvent } from "@nostr-dev-kit/ndk";
import { NPub07, useUserProfileStore } from '@/features/user-profile/UserProfileStore'
import _ from "lodash";
import dynamic from 'next/dynamic';

const JsonViewerDyn = dynamic(
    () => import('@/components/JsonViewer'), 
    {  ssr: false }
  );
  
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
    const { fetchEvents } = useNDK();

    useEffect(() => {
        const fetch = async () => {
            setEvents([]);
            setLoading(true);
            const filterToApply: NDKFilter = filter ? filter : defaultFilter;
            const evs = await fetchEvents(filterToApply);
            setEvents(evs);
            setLoading(false);
        };
        fetch();

    }, [fetchEvents, filter])

    const eventDivs: JSX.Element[] = [];
    _.forEach(events, (ev) => {
        const isSelected = (ev.id === currentEventId);
        eventDivs.push(
            <div className='p-1' id={ev.id} key={ev.id}>
                <JsonViewerDyn ndkEvent={ev.rawEvent()} isSelected={isSelected}/>
            </div>);
    })

    return <>
        <div><button>Refresh</button></div>
        <div className='overflow-y-auto overflow-x-hidden' >
            {isLoading ? "Loading..." : eventDivs}
        </div>
    </>
    
}

export default NostrEvents;