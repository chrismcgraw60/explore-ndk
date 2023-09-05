import { useState, useEffect, JSX } from 'react';
import { useNDK } from "@nostr-dev-kit/ndk-react";
import { NDKFilter, NDKEvent } from "@nostr-dev-kit/ndk/ndk";
import _ from "lodash";

export default function NostrEvents() {

    const [events, setEvents] = useState<NDKEvent[] | null>(null);
    const { fetchEvents } = useNDK();

    useEffect(() => {
        
        const filter: NDKFilter = {
            kinds: [1],
            "#t": ["ndk"],
        };

        const fetch = async () => {
            const evs = await fetchEvents(filter);
            setEvents(evs);
        };

        fetch();

    }, [fetchEvents])

    const eventDivs: JSX.Element[] = [];
    _.forEach(events, (ev) => {
        eventDivs.push(<div>{ev.content}</div>);
    })

    return <>
        <div className="min-h-full">
            {eventDivs}
        </div>
    </>
}