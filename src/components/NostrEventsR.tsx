'use client'

import { useState, useEffect, JSX, useCallback, useReducer } from 'react';
import { useNDK } from "@nostr-dev-kit/ndk-react";
import NDK, { NDKFilter, NDKEvent, NDKSubscription } from "@nostr-dev-kit/ndk";
import { NPub07, useUserProfileStore } from '@/features/user-profile/UserProfileStore'
import _, { sumBy } from "lodash";
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

function eventReducer(state: NDKEvent[], ndkEv: NDKEvent) {
    return [...state, ndkEv];
}

const NostrEventsR = ({filter, currentEventId} : NostrEventProps) => {

    const [ndkSub, setNdkSub] = useState<NDKSubscription | undefined>(undefined)
    const [isLoading, setLoading] = useState<boolean>(false);
    const [events, dispatch] = useReducer(eventReducer, []);
    const { ndk } = useNDK();

    const filterToApply: NDKFilter = filter ? filter : defaultFilter;

    useEffect(() => {
        if (!ndk || ndkSub) return;

        const sub = ndk.subscribe(filterToApply, {});

        sub.on("event", (ndkEv: NDKEvent) => {
            ndkEv.ndk = ndk;
            dispatch(ndkEv);
        });

        setNdkSub(sub);
    }, [ndk, filterToApply, ndkSub, events]);

    const eventDivs: JSX.Element[] = [];
    _.forEach(events, (ev) => {
        const isSelected = (ev.id === currentEventId);
        eventDivs.push(
            <div className='p-1' id={ev.id} key={ev.id}>
                <JsonViewerDyn ndkEvent={ev.rawEvent()} isSelected={isSelected}/>
            </div>);
    })

    return <>
        <div className='overflow-y-auto overflow-x-hidden' >
            {isLoading ? "Loading..." : eventDivs}
        </div>
    </>
    
}

export default NostrEventsR;
