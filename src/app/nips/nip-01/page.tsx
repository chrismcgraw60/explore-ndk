'use client'

import EventEditor from "@/components/EventEditor"

export default function NipsHome() {
    return (    
        <div className='flex flex-col h-screen w-full'>
            <div>NIP-01</div>
            <EventEditor/>
        </div>
    )
}