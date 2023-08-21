'use client'
import FlowNDKProvider from "@/components/FlowNDKProvider";
import NostrEvents from "@/components/NostrEvents";

export default function NipsHome() {
    return <>

        <div className="flex w-32 p-4">
            <div>NIPs</div>
            <nav>
                nav
            </nav>
        </div>

        <div className="flex flex-1 flex-col">
            <div id="content" className=" flex flex-1 overflow-y-auto paragraph px-4 bg-gray-500">
                <FlowNDKProvider>
                    <NostrEvents></NostrEvents>
                </FlowNDKProvider>
            </div>
        </div>

    </>
}